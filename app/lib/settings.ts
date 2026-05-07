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
  affiliateNetwork: {
    multinational: Array<{ name: string; logoUrl: string }>;
    local: Array<{ name: string; logoUrl: string }>;
  };
  awards: Array<{ title: string; subtitle: string }>;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Skytech Ghana",
  siteDescription: "We build websites and mobile apps for businesses.",
  contactEmail: "hello@skytech.com",
  contactPhone: "+1 (555) 123-4567",
  whatsapp: "+233 20 123 4567",
  address: "Tech Hub, San Francisco, CA 94105, USA",
  pricingBookletUrl: "",
  pricing: {
    websitePackages: [],
    appPackages: [],
    seoGrowthPlan: { name: "", priceRange: "", items: [] },
  },
  affiliateNetwork: {
    multinational: [],
    local: [],
  },
  awards: [],
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    await dbConnect();
    const settings = await Settings.findOne({}).lean();
    if (!settings) {
      return { ...DEFAULT_SETTINGS };
    }
    return {
      ...DEFAULT_SETTINGS,
      ...settings,
    } as SiteSettings;
  } catch (error) {
    console.error("Failed to fetch settings from MongoDB:", error);
    return { ...DEFAULT_SETTINGS };
  }
}
