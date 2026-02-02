import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import resolveSharedData from "../../../lib/sharedData";

const DATA_FILE = path.join(resolveSharedData(), "pages.json");

export async function GET() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      return NextResponse.json({
        home: {},
        services: {},
        contact: {},
        about: {},
      });
    }
    const data = fs.readFileSync(DATA_FILE, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error("Failed to read pages data:", error);
    return NextResponse.json(
      { error: "Failed to read pages data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    fs.writeFileSync(DATA_FILE, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save pages data:", error);
    return NextResponse.json(
      { error: "Failed to save pages data" },
      { status: 500 },
    );
  }
}
