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
  partners: [],
  awards: [
    { title: "Best Web Development Agency 2023", subtitle: "Ghana Tech Awards" },
    { title: "Innovation in Mobile Apps", subtitle: "Digital Excellence Forum" }
  ],
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    await dbConnect();
    const settings = await Settings.findOne().lean();
    if (!settings) {
      return DEFAULT_SETTINGS;
    }
    // Merge with defaults to ensure all fields exist
    return { ...DEFAULT_SETTINGS, ...settings } as SiteSettings;
  } catch (error) {
    console.error("Error fetching settings:", error);
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(settings: Partial<SiteSettings>): Promise<void> {
  try {
    await dbConnect();
    await Settings.findOneAndUpdate({}, settings, { upsert: true, new: true });
  } catch (error) {
    console.error("Error saving settings:", error);
    throw error;
  }
}

