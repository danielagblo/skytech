import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const filename = searchParams.get("file");

    if (!filename) {
      return NextResponse.json({ error: "No file specified" }, { status: 400 });
    }

    // Validate filename to prevent directory traversal
    if (filename.includes("..") || filename.includes("/")) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Read file from shared-data/booklets
    const filepath = resolveSharedData("booklets", filename);
    const fileContent = await readFile(filepath);

    // Return PDF with proper headers
    return new NextResponse(fileContent, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("View PDF error:", error);
    return NextResponse.json({ error: "Failed to view file" }, { status: 500 });
  }
}
