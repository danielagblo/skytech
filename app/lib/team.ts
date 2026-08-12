import { isMysql } from "./db";
import * as mysql from "./mysql";
import dbConnect from "./mongodb";
import TeamMember from "../models/TeamMember";

export interface ITeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  iconType?: string;
  order?: number;
}

async function getTeamMembersMysql(): Promise<ITeamMember[]> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, name, role, bio, image_url, icon_type, sort_order FROM team_members ORDER BY sort_order ASC, id ASC",
  );
  return rows.map((r) => ({
    _id: r.id,
    name: r.name || "",
    role: r.role || "",
    bio: r.bio || "",
    imageUrl: r.image_url || undefined,
    iconType: r.icon_type || "default",
    order: r.sort_order ?? 0,
  }));
}

async function saveTeamMembersMysql(members: ITeamMember[]): Promise<void> {
  await mysql.initSchema();
  await mysql.clear("team_members");
  for (let idx = 0; idx < members.length; idx++) {
    const m = members[idx];
    await mysql.insert("team_members", {
      name: m.name,
      role: m.role,
      bio: m.bio,
      image_url: m.imageUrl ?? null,
      icon_type: m.iconType ?? "default",
      sort_order: idx,
    });
  }
}

export async function getTeamMembers(): Promise<ITeamMember[]> {
  if (isMysql()) {
    try {
      return await getTeamMembersMysql();
    } catch (error) {
      console.error("Error fetching team members (mysql):", error);
      return [];
    }
  }
  try {
    await dbConnect();
    const members = await TeamMember.find({}).sort({ order: 1 }).lean();
    return JSON.parse(JSON.stringify(members));
  } catch (error) {
    console.error("Error fetching team members:", error);
    return [];
  }
}

export async function saveTeamMembers(members: ITeamMember[]): Promise<void> {
  if (isMysql()) {
    await saveTeamMembersMysql(members);
    return;
  }
  try {
    await dbConnect();
    await TeamMember.deleteMany({});
    if (members.length > 0) {
      await TeamMember.insertMany(members.map((m, idx) => {
        const { _id, ...memberData } = m;
        return {
          ...memberData,
          order: idx
        };
      }));
    }

  } catch (error) {
    console.error("Error saving team members:", error);
    throw error;
  }
}