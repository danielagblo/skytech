import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  siteName: String,
  siteDescription: String,
  contactEmail: String,
  contactPhone: String,
  whatsapp: String,
  address: String,
  pricingBookletUrl: String,
  pricing: {
    websitePackages: [
      {
        name: String,
        tagline: String,
        timeline: String,
        price: String,
        badge: String,
        highlights: [String],
      },
    ],
    appPackages: [
      {
        name: String,
        tagline: String,
        timeline: String,
        price: String,
        badge: String,
        highlights: [String],
      },
    ],
    seoGrowthPlan: {
      name: String,
      priceRange: String,
      items: [String],
    },
  },
  affiliateNetwork: {
    multinational: [
      {
        name: String,
        logoUrl: String,
      },
    ],
    local: [
      {
        name: String,
        logoUrl: String,
      },
    ],
  },
  awards: [
    {
      title: String,
      subtitle: String,
    },
  ],
});

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
