import { NextRequest, NextResponse } from "next/server";
import { isMysql } from "../../../lib/db";
import * as mysql from "../../../lib/mysql";
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

async function parseBody(request: NextRequest): Promise<any> {
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
    submission = await request.json();
  }
  return submission;
}

export async function POST(request: NextRequest) {
  try {
    const submission = await parseBody(request);

    if (isMysql()) {
      await mysql.initSchema();
      const id = await mysql.insert("internship_submissions", {
        data: JSON.stringify(submission),
        enrolled: mysql.toBool(submission.enrolled),
        submitted_at: new Date(),
      });
      return NextResponse.json(
        { success: true, id },
        { headers: corsHeaders },
      );
    }

    await dbConnect();
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
    if (isMysql()) {
      await mysql.initSchema();
      const rows = await mysql.query(
        "SELECT id, data, enrolled, submitted_at FROM internship_submissions ORDER BY submitted_at DESC",
      );
      const formattedSubmissions = rows.map((s) => {
        const data = mysql.parseJson<Record<string, any>>(s.data) || {};
        return {
          ...data,
          _id: s.id,
          id: s.id,
          enrolled: mysql.fromBool(s.enrolled),
          submittedAt: s.submitted_at,
        };
      });
      return NextResponse.json(formattedSubmissions, { headers: corsHeaders });
    }

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
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (isMysql()) {
      await mysql.initSchema();
      await mysql.remove("internship_submissions", id);
      return NextResponse.json(
        { success: true },
        { headers: corsHeaders },
      );
    }

    await dbConnect();
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
    const { id, enrolled, image } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    if (isMysql()) {
      await mysql.initSchema();
      const updates: Record<string, any> = {};
      if (typeof enrolled !== "undefined") {
        updates.enrolled = mysql.toBool(enrolled);
      }
      if (typeof image !== "undefined") {
        const rows = await mysql.query(
          "SELECT data FROM internship_submissions WHERE id = ? LIMIT 1",
          [id],
        );
        const existing = rows[0]
          ? mysql.parseJson<Record<string, any>>(rows[0].data) || {}
          : {};
        updates.data = JSON.stringify({ ...existing, image });
      }
      await mysql.update("internship_submissions", id, updates);
      return NextResponse.json(
        { success: true, ...updates },
        { headers: corsHeaders },
      );
    }

    await dbConnect();
    const updatePayload: Record<string, any> = {};
    if (typeof enrolled !== "undefined") {
      updatePayload.enrolled = Boolean(enrolled);
    }
    if (typeof image !== "undefined") {
      updatePayload.image = image;
    }
    const updated = await InternshipSubmission.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true },
    );

    if (!updated) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404, headers: corsHeaders },
      );
    }

    return NextResponse.json(
      { success: true, enrolled: updated.enrolled, image: updated.image },
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