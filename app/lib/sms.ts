const ARKESEL_URL = "https://sms.arkesel.com/api/v2/sms/send";

export type SmsSendResult = {
  ok: boolean;
  status: number;
  data?: unknown;
  error?: string;
};

export async function sendSms(options: {
  message: string;
  recipients: string[];
}): Promise<SmsSendResult> {
  const apiKey = process.env.ARKESEL_API_KEY;
  const senderId = process.env.ARKESEL_SENDER_ID || "Skytech";

  if (!apiKey) {
    return { ok: false, status: 500, error: "ARKESEL_API_KEY is not configured" };
  }

  const message = String(options.message || "").trim();
  const recipients = options.recipients
    .map((r) => String(r).replace(/[^\d]/g, ""))
    .filter(Boolean);

  if (!message) {
    return { ok: false, status: 400, error: "message is required" };
  }
  if (recipients.length === 0) {
    return { ok: false, status: 400, error: "recipients is required" };
  }

  try {
    const res = await fetch(ARKESEL_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
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
      return {
        ok: false,
        status: res.status,
        data,
        error: "Arkesel request failed",
      };
    }

    return { ok: true, status: res.status, data };
  } catch (error) {
    console.error("Failed to send Arkesel SMS:", error);
    return { ok: false, status: 500, error: "Failed to send SMS" };
  }
}