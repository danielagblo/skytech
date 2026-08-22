/** Canonical Ghana WhatsApp number for all site chat links (no + or spaces). */
export const WHATSAPP_NUMBER = "233538311626";

export function toWaDigits(value?: string | null): string {
  if (!value) return "";
  return String(value).replace(/[^\d]/g, "");
}

export function getWhatsAppDigits(value?: string | null): string {
  const digits = toWaDigits(value);
  return digits || WHATSAPP_NUMBER;
}

export function getWhatsAppUrl(value?: string | null, text?: string): string {
  const digits = getWhatsAppDigits(value);
  if (text) {
    return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
  }
  return `https://wa.me/${digits}`;
}
