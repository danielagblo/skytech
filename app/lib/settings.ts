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
  awards: Array<{ title: string; subtitle: string }>;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  siteName: "Skytech Ghana",
  siteDescription: "No 1# website development company in Ghana.",
  contactEmail: "hello@skytechgh.com",
  contactPhone: "+233 53 831 1626",
  whatsapp: "233538311626",
  address: "Accra, Ghana",
  pricingBookletUrl: "/static/pricing.pdf",
  pricing: {
    websitePackages: [],
    appPackages: [],
    seoGrowthPlan: { name: "", priceRange: "", items: [] },
  },
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
