import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Testimonial from "../../../models/Testimonial";

export async function GET() {
  try {
    await dbConnect();
    const testimonials = await Testimonial.find({});
    return NextResponse.json(testimonials);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read testimonials data" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await dbConnect();
    
    if (Array.isArray(body)) {
      await Testimonial.deleteMany({});
      await Testimonial.insertMany(body);
    } else {
      await Testimonial.deleteMany({});
      await Testimonial.create(body);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save testimonials data" },
      { status: 500 },
    );
  }
}
