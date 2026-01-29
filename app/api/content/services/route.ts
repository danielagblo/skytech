import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

import resolveSharedData from "../../../lib/sharedData";

const DATA_DIR = resolveSharedData();

export async function GET() {
  try {
    const filePath = path.join(DATA_DIR, "services.json");
    const data = fs.readFileSync(filePath, "utf-8");
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read services data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const filePath = path.join(DATA_DIR, "services.json");
    fs.writeFileSync(filePath, JSON.stringify(body, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save services data" },
      { status: 500 },
    );
  }
}
