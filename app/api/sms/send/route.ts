import { NextRequest, NextResponse } from "next/server";

const ARKESEL_URL = "https://sms.arkesel.com/api/v2/sms/send";

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
    const apiKey = process.env.ARKESEL_API_KEY;
    const senderId = process.env.ARKESEL_SENDER_ID || "Skytech";

    if (!apiKey) {
      return NextResponse.json(
        { error: "ARKESEL_API_KEY is not configured" },
        { status: 500 },
      );
    }

    const body = await request.json();
    const message = String(body.message || "").trim();
    const recipients: string[] = Array.isArray(body.recipients)
      ? body.recipients.map((r: unknown) => String(r).replace(/[^\d]/g, ""))
      : [];

    if (!message) {
      return NextResponse.json({ error: "message is required" }, { status: 400 });
    }
    if (recipients.length === 0) {
      return NextResponse.json({ error: "recipients is required" }, { status: 400 });
    }

    const res = await fetch(ARKESEL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        sender: senderId,
        message,
        recipients,
        sandbox: false,
      }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return NextResponse.json(
        { error: "Arkesel request failed", details: data },
        { status: res.status },
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Failed to send Arkesel SMS:", error);
    return NextResponse.json({ error: "Failed to send SMS" }, { status: 500 });
  }
}
