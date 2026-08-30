export const SKYTECH_DISPLAY_PHONE = "+233 53 831 1626";
export const SKYTECH_PHONE_DIGITS = "233538311626";

export function normalizeGhanaNumber(value?: string | null): string {
  if (!value) return "";
  const digits = String(value).replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("233")) return digits;
  if (digits.startsWith("0")) return "233" + digits.slice(1);
  if (digits.length <= 9) return "233" + digits;
  return digits;
}

export function buildWhatsAppApprovalMessage(name: string, startDate: string): string {
  return [
    `Dear ${name},`,
    "",
    "Congratulations! We are pleased to inform you that your application for the internship program at SkyTech Ghana has been approved.",
    "",
    "Please report on the start date:",
    `*${startDate}*`,
    "",
    `If you have any questions before your start date, feel free to reach out on ${SKYTECH_DISPLAY_PHONE}.`,
    "",
    "Welcome aboard!",
  ].join("\n");
}

export function buildSmsApprovalMessage(name: string, startDate: string): string {
  const message = `Dear ${name}, your internship at SkyTech Ghana is approved. Start date: ${startDate}. Questions? Call/WhatsApp ${SKYTECH_DISPLAY_PHONE}.`;
  return message.slice(0, 160);
}

export function buildApprovalWhatsAppUrl(
  phone: string,
  name: string,
  startDate: string,
): string {
  const digits = normalizeGhanaNumber(phone);
  const text = buildWhatsAppApprovalMessage(name, startDate);
  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}