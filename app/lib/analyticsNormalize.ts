const SOCIAL_SOURCES = new Set([
  "tiktok",
  "facebook",
  "fb",
  "instagram",
  "ig",
  "youtube",
  "twitter",
  "linkedin",
]);

const PAID_MEDIUMS = new Set([
  "paid",
  "cpc",
  "cpm",
  "ppc",
  "paidsocial",
  "social",
  "ads",
  "ad",
  "paid_social",
]);

export function isAdminPath(page: string | undefined | null): boolean {
  const p = String(page || "").split("?")[0];
  return (
    p.startsWith("/dashboard") ||
    p.startsWith("/login") ||
    p.startsWith("/admin") ||
    p.startsWith("/api")
  );
}

export function normalizePage(page: string | undefined | null): string {
  let p = String(page || "/").split("?")[0].trim() || "/";
  p = p.replace(/\/+$/, "") || "/";
  p = decodeURIComponent(p).replace(/\s+/g, "");

  if (p === "/site/internship") return "/internship";
  if (p.startsWith("/site/internship/")) return "/internship";
  if (p === "/site/about") return "/about";
  if (p === "/site/blog") return "/insights";
  if (p.startsWith("/site/blog/")) return p.replace("/site/blog/", "/insights/");
  if (p === "/site") return "/";

  return p;
}

export function normalizeSourceLabel(raw: string | undefined | null): string {
  if (!raw || raw === "direct") return "direct";
  const value = String(raw).trim().toLowerCase();
  if (!value || value === "direct") return "direct";

  if (value === "fb" || value.includes("facebook") || value.includes("fb.")) return "facebook";
  if (value.includes("instagram") || value === "ig") return "instagram";
  if (value.includes("tiktok")) return "tiktok";
  if (value.includes("google") || value.includes("googlequicksearchbox")) return "google";
  if (value.includes("youtube")) return "youtube";
  if (value.includes("whatsapp") || value.includes("wa.me")) return "whatsapp";
  if (value.includes("linkedin")) return "linkedin";
  if (value.includes("twitter") || value.includes("x.com") || value.includes("t.co")) return "twitter";

  if (
    value.includes("skytechghana.com") ||
    value === "internal" ||
    value.includes("localhost") ||
    value.includes("hostinger") ||
    value.includes("hpanel")
  ) {
    return "internal";
  }

  if (value.startsWith("http")) {
    try {
      const host = new URL(value).hostname.replace(/^www\./, "");
      return normalizeSourceLabel(host);
    } catch {
      return "referral";
    }
  }

  if (value.startsWith("android-app://")) {
    if (value.includes("google")) return "google";
    if (value.includes("facebook") || value.includes("fb")) return "facebook";
    if (value.includes("instagram")) return "instagram";
    return "app";
  }

  return value.slice(0, 60);
}

export function campaignIntentPath(searchParams: URLSearchParams): string | null {
  const source = (searchParams.get("utm_source") || searchParams.get("source") || "").toLowerCase();
  const medium = (searchParams.get("utm_medium") || "").toLowerCase();
  const campaign = (searchParams.get("utm_campaign") || "").toLowerCase();
  const content = (searchParams.get("utm_content") || "").toLowerCase();

  const isCampaign =
    SOCIAL_SOURCES.has(source) ||
    PAID_MEDIUMS.has(medium) ||
    Boolean(searchParams.get("utm_campaign"));

  if (!isCampaign) return null;
  if (content === "home" || campaign.includes("homebrand")) return null;

  if (campaign.includes("intern") || content.includes("intern")) return "/internship";
  if (campaign.includes("price") || content.includes("pricing")) return "/pricing";
  if (campaign.includes("foundat") || content.includes("foundation")) return "/foundation";
  return "/landing";
}

export function extractCampaign(event: any): string {
  const nested =
    typeof event?.data === "string"
      ? safeJson(event.data)
      : event?.data && typeof event.data === "object"
        ? event.data
        : null;
  const raw =
    event?.campaign ||
    nested?.campaign ||
    event?.utm_campaign ||
    nested?.utm_campaign ||
    "";
  return String(raw || "").slice(0, 80);
}

function safeJson(value: string): any {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

export const NOISE_ACTIONS = new Set([
  "click",
  "Synchronizing Network...",
  "Save Hero Content",
  "Sign in",
  "Close menu",
]);
