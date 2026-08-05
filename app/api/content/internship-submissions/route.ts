import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import InternshipSubmission from "../../../models/InternshipSubmission";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const contentType = (request.headers.get("content-type") || "").toLowerCase();
    let submission: any = {};

    if (contentType.includes("application/json")) {
      submission = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      for (const [key, value] of Array.from(form.entries())) {
        if (typeof value === "string") submission[key] = value;
        else if (value instanceof File) submission[key] = value.name;
        else submission[key] = String(value);
      }
    } else {
      try {
        submission = await request.json();
      } catch (e) {
        return NextResponse.json(
          { error: "Unsupported content type or malformed body" },
          { status: 400, headers: corsHeaders },
        );
      }
    }

    const newEntry = await InternshipSubmission.create({
      ...submission,
      submittedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, id: newEntry._id },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Failed to save submission:", error);
    return NextResponse.json(
      { error: "Failed to save submission: " + String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function GET() {
  try {
    await dbConnect();
    const submissions = await InternshipSubmission.find({}).sort({ submittedAt: -1 }).lean();
    
    // Map _id to id for frontend compatibility
    const formattedSubmissions = submissions.map((s: any) => ({
      ...s,
      id: s._id.toString(),
    }));

    return NextResponse.json(formattedSubmissions, { headers: corsHeaders });
  } catch (error) {
    console.error("Failed to fetch submissions:", error);
    return NextResponse.json(
      { error: "Failed to fetch submissions" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    await InternshipSubmission.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Failed to delete submission:", error);
    return NextResponse.json(
      { error: "Failed to delete submission" },
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();
    const { id, enrolled } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    const updated = await InternshipSubmission.findByIdAndUpdate(
      id,
      { $set: { enrolled: Boolean(enrolled) } },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { success: true, enrolled: updated.enrolled },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Failed to update submission:", error);
    return NextResponse.json(
      { error: "Failed to update submission: " + String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}
