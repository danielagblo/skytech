import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Page from "../../../models/Page";

export async function GET() {
  try {
    await dbConnect();
    const pageDoc = await Page.findOne({ name: "all_pages" });
    
    if (!pageDoc) {
      return NextResponse.json({
        home: {},
        services: {},
        contact: {},
        about: {},
      });
    }
    
    return NextResponse.json(pageDoc.content);
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
    await dbConnect();
    
    await Page.findOneAndUpdate(
      { name: "all_pages" },
      { content: body },
      { upsert: true },
    );
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save pages data:", error);
    return NextResponse.json(
      { error: "Failed to save pages data" },
      { status: 500 },
    );
  }
}
