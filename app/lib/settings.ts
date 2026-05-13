import dbConnect from "./mongodb";
import Settings from "../models/Settings";

export type SiteSettings = {
  siteName: string;
  siteDescription: string;
  contactEmail: string;
  contactPhone: string;
  whatsapp: string;
  address: string;
  pricingBookletUrl: string;
  pricing: {
    websitePackages: Array<{
      name: string;
      tagline: string;
      timeline: string;
      price: string;
      badge?: string;
      highlights: string[];
    }>;
    appPackages: Array<{
      name: string;
      tagline: string;
      timeline: string;
      price: string;
      badge?: string;
      highlights: string[];
    }>;
    seoGrowthPlan: {
      name: string;
      priceRange: string;
      items: string[];
    };
  };
  partners: Array<{ name: string; logoUrl: string }>;
  awards: Array<{ title: string; subtitle: string }>;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Skytech Ghana",
  siteDescription: "No 1# website development company in Ghana.",
  contactEmail: "hello@skytechgh.com",
  contactPhone: "+233 50 000 0000",
  whatsapp: "+233 50 000 0000",
  address: "Accra, Ghana",
  pricingBookletUrl: "/static/pricing.pdf",
  pricing: {
    websitePackages: [],
    appPackages: [],
    seoGrowthPlan: { name: "", priceRange: "", items: [] },
  },
  partners: [
    { name: "Partner 1", logoUrl: "/images/Logo-DPCrdneV.png" },
    { name: "Partner 2", logoUrl: "/images/k-logo.png" },
    { name: "Partner 3", logoUrl: "/images/favicon (1).png" },
    { name: "Partner 4", logoUrl: "/images/logo.png" },
    { name: "Partner 5", logoUrl: "/images/logo.webp" },
    { name: "Partner 6", logoUrl: "/images/favicon.png" },
    { name: "Partner 7", logoUrl: "/images/logo-transparent.png" },
  ],
  awards: [
    { title: "Best Web Development Agency 2023", subtitle: "Ghana Tech Awards" },
    { title: "Innovation in Mobile Apps", subtitle: "Digital Excellence Forum" }
  ],
};

export async function getSettings(): Promise<SiteSettings> {
  return DEFAULT_SETTINGS;
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  // Settings are now hardcoded and not saved to MongoDB
  return;
}
