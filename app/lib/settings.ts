import fs from "fs";

import resolveSharedData from "./sharedData";

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  pricingBookletUrl: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "SkyTech",
  siteDescription: "We build websites and mobile apps for businesses.",
  contactEmail: "hello@skytech.com",
  contactPhone: "+1 (555) 123-4567",
  whatsapp: "+233 20 123 4567",
  address: "Tech Hub, San Francisco, CA 94105, USA",
  pricingBookletUrl: "",
};

export function getSettings(): SiteSettings {
  const filePath = resolveSharedData("settings.json");
  try {
    if (!fs.existsSync(filePath)) {
      return { ...DEFAULT_SETTINGS };
    }
    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch (error) {
    console.error("Failed to read settings.json:", error);
    return { ...DEFAULT_SETTINGS };
  }
}
