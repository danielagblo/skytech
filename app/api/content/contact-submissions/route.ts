import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { isMysql } from "../../../lib/db";
import * as mysql from "../../../lib/mysql";
import { resolveSharedData } from "../../../lib/sharedData";

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
    const contentType = (
      request.headers.get("content-type") || ""
    ).toLowerCase();
    let submission: any = {};

    if (contentType.includes("application/json")) {
      submission = await request.json();
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      const form = await request.formData();
      submission = {};
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

    if (isMysql()) {
      await mysql.initSchema();
      const id = await mysql.insert("contact_submissions", {
        data: JSON.stringify({ ...submission, id: undefined }),
        submitted_at: new Date(),
      });
      return NextResponse.json(
        { success: true, id },
        { headers: corsHeaders },
      );
    }

    const filePath = resolveSharedData("contact-submissions.json");
    let submissions: any[] = [];
    if (fs.existsSync(filePath)) {
      try {
        submissions = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (e) {
        submissions = [];
      }
    }

    const newEntry = {
      id: Date.now(),
      submittedAt: new Date(),
      ...submission,
    };

    submissions.push(newEntry);
    fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));

    return NextResponse.json(
      { success: true, id: newEntry.id },
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

export async function GET(request: NextRequest) {
  try {
    if (isMysql()) {
      await mysql.initSchema();
      const rows = await mysql.query(
        "SELECT id, data, submitted_at FROM contact_submissions ORDER BY submitted_at DESC",
      );
      const submissions = rows.map((r) => {
        const data = mysql.parseJson<Record<string, any>>(r.data) || {};
        return {
          ...data,
          id: r.id,
          submittedAt: r.submitted_at,
        };
      });
      return NextResponse.json(submissions, { headers: corsHeaders });
    }

    const filePath = resolveSharedData("contact-submissions.json");
    if (!fs.existsSync(filePath)) {
      return NextResponse.json([], { headers: corsHeaders });
    }
    
    const submissions = JSON.parse(fs.readFileSync(filePath, "utf8"));
    submissions.sort((a: any, b: any) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());

    return NextResponse.json(submissions, { headers: corsHeaders });
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
      await mysql.remove("contact_submissions", id);
      return NextResponse.json(
        { success: true },
        { headers: corsHeaders },
      );
    }

    const filePath = resolveSharedData("contact-submissions.json");
    if (fs.existsSync(filePath)) {
      let submissions = JSON.parse(fs.readFileSync(filePath, "utf8"));
      submissions = submissions.filter((s: any) => s.id !== parseInt(id));
      fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
    }

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