import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Service from "../../../models/Service";

export async function GET() {
  try {
    await dbConnect();
    const services = await Service.find({});
    return NextResponse.json(services);
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
    await dbConnect();
    
    // If body is an array, we replace all services
    if (Array.isArray(body)) {
      await Service.deleteMany({});
      const services = await Service.insertMany(body);
      return NextResponse.json({ success: true, count: services.length });
    } else {
      // If it's a single object, maybe update or create?
      // Based on original code, it was replacing the whole file content.
      // So deleteMany + insertMany is the equivalent of writeFileSync with the whole array.
      await Service.deleteMany({});
      const service = await Service.create(body);
      return NextResponse.json({ success: true });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save services data" },
      { status: 500 },
    );
  }
}
