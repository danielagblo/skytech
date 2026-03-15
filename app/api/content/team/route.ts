import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import TeamMember from "../../../models/TeamMember";

export async function GET() {
  try {
    await dbConnect();
    const team = await TeamMember.find({});
    return NextResponse.json(team);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read team data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    if (Array.isArray(body)) {
      await TeamMember.deleteMany({});
      await TeamMember.insertMany(body);
    } else {
      await TeamMember.deleteMany({});
      await TeamMember.create(body);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save team data" },
      { status: 500 },
    );
  }
}
