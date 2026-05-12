import fs from "fs";
import { resolveSharedData } from "./sharedData";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  avatar: string;
}

const DEFAULT_TEAM: TeamMember[] = [
  {
    id: "1",
    name: "Lead Engineer",
    role: "Fullstack Architect",
    focus: "Technical delivery and system architecture.",
    avatar: "/images/team/placeholder.jpg",
  }
];

export async function getTeam(): Promise<TeamMember[]> {
  try {
    const filePath = resolveSharedData("team.json");
    if (!fs.existsSync(filePath)) {
      return DEFAULT_TEAM;
    }
    
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Failed to read team data from local file:", error);
    return DEFAULT_TEAM;
  }
}

export async function saveTeam(team: TeamMember[]): Promise<void> {
  const filePath = resolveSharedData("team.json");
  fs.writeFileSync(filePath, JSON.stringify(team, null, 2));
}
