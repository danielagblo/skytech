import { NextResponse } from "next/server";
import fs from "fs";
import { resolveSharedData } from "../../../lib/sharedData";

export async function GET() {
  try {
    const filePath = resolveSharedData("team.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([]);
    }
    
    const data = fs.readFileSync(filePath, "utf8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Failed to read team data from file:", error);
    return NextResponse.json(
      { error: "Failed to read team data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = resolveSharedData("team.json");
    
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save team data to file:", error);
    return NextResponse.json(
      { error: "Failed to save team data" },
      { status: 500 },
    );
  }
}
