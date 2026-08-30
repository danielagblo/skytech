import { NextRequest, NextResponse } from "next/server";
import { isMysql } from "../../../lib/db";
import * as mysql from "../../../lib/mysql";
import dbConnect from "../../../lib/mongodb";
import InternshipSubmission from "../../../models/InternshipSubmission";
import { sendSms } from "../../../lib/sms";
import {
  buildApprovalWhatsAppUrl,
  buildSmsApprovalMessage,
  normalizeGhanaNumber,
} from "../../../lib/approvalNotify";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Submission ID is required" },
        { status: 400, headers: corsHeaders },
      );
    }

    let name = "";
    let phone = "";
    let startDate = "";

    if (isMysql()) {
      await mysql.initSchema();
      const rows = await mysql.query(
        "SELECT data FROM internship_submissions WHERE id = ? LIMIT 1",
        [id],
      );
      const data = rows[0]
        ? mysql.parseJson<Record<string, any>>(rows[0].data) || {}
        : {};
      name = data.name || "";
      phone = data.phone || "";
      startDate = data.startDate || "";
    } else {
      await dbConnect();
      const submission: any = await InternshipSubmission.findById(id).lean();
      if (submission) {
        name = submission.name || "";
        phone = submission.phone || "";
        startDate = submission.startDate || "";
      }
    }

    if (!phone) {
      return NextResponse.json(
        { error: "Applicant phone number is missing" },
        { status: 400, headers: corsHeaders },
      );
    }

    const whatsappUrl = buildApprovalWhatsAppUrl(phone, name, startDate);
    const sms = await sendSms({
      message: buildSmsApprovalMessage(name, startDate),
      recipients: [normalizeGhanaNumber(phone)],
    });

    return NextResponse.json(
      {
        success: true,
        sms: { sent: sms.ok, error: sms.error },
        whatsappUrl,
      },
      { headers: corsHeaders },
    );
  } catch (error) {
    console.error("Failed to send internship approval notifications:", error);
    return NextResponse.json(
      { error: "Failed to send approval notifications: " + String(error) },
      { status: 500, headers: corsHeaders },
    );
  }
}