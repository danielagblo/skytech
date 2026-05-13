import dbConnect from "./mongodb";

import TeamMember from "../models/TeamMember";

export interface ITeamMember {
  _id?: string;
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  order?: number;
}

export async function getTeamMembers(): Promise<ITeamMember[]> {
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
  try {
    await dbConnect();
    await TeamMember.deleteMany({});
    if (members.length > 0) {
      await TeamMember.insertMany(members.map((m, idx) => ({
        ...m,
        order: idx
      })));
    }
  } catch (error) {
    console.error("Error saving team members:", error);
    throw error;
  }
}
