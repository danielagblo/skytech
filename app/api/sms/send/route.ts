import { NextRequest, NextResponse } from "next/server";
import { sendSms } from "../../../lib/sms";

export async function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await sendSms({
      message: body.message,
      recipients: Array.isArray(body.recipients)
        ? body.recipients.map((r: unknown) => String(r))
        : [],
    });

    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, details: result.data },
        { status: result.status || 500 },
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    console.error("Failed to send Arkesel SMS:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}