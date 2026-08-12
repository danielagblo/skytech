import { NextResponse } from "next/server";
import { getTestimonials, saveTestimonials } from "../../../lib/testimonials";

export async function GET() {
  try {
    const testimonials = await getTestimonials();
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

    if (Array.isArray(body)) {
      await saveTestimonials(body);
    } else {
      await saveTestimonials([body]);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to save testimonials data" },
      { status: 500 },
    );
  }
}