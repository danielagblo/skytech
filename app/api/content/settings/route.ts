import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Settings from "../../../models/Settings";

export async function GET() {
  try {
    await dbConnect();
    let settings = await Settings.findOne({});
    
    if (!settings) {
      const defaultSettings = {
        contactEmail: "info@skytech.example",
        contactPhone: "+233 000 000 000",
        whatsapp: "+233000000000",
        address: "",
        pricingBookletUrl: "",
      };
      settings = await Settings.create(defaultSettings);
    }
    
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/content/settings error:", error);
    return NextResponse.json(
      { error: "Failed to read settings data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    let settings = await Settings.findOne({});
    if (settings) {
      await Settings.findByIdAndUpdate(settings._id, body);
    } else {
      await Settings.create(body);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/content/settings error:", error);
    return NextResponse.json(
      { error: "Failed to save settings data" },
      { status: 500 },
    );
  }
}
