import dbConnect from "./mongodb";
import Pricing from "../models/Pricing";

export interface PricingPackage {
  name: string;
  tier: string;
  price: string;
  usd: string;
  renewal: string;
  interval?: string;
  featured?: boolean;
  highlights: string[];
}

export interface PricingCategory {
  category: string;
  label: string;
  packages: PricingPackage[];
  updatedAt?: string | Date;
}

const DEFAULT_PRICING: PricingCategory[] = [
  {
    category: "web",
    label: "Web Development",
    packages: [
      {
        name: "Basic Website Package",
        tier: "Startup",
        price: "2,500",
        usd: "175",
        renewal: "1,000",
        highlights: ["5-6 Pages", "SEO", "Support"],
      }
    ]
  }
];

export async function getPricing(): Promise<PricingCategory[]> {
  try {
    await dbConnect();
    const pricing = await Pricing.find({}).lean();
    
    if (!pricing || pricing.length === 0) {
      return DEFAULT_PRICING;
    }
    
    return JSON.parse(JSON.stringify(pricing));
  } catch (error) {
    console.error("Failed to fetch pricing from MongoDB:", error);
    return DEFAULT_PRICING;
  }
}

export async function savePricing(pricing: PricingCategory[]): Promise<void> {
  try {
    await dbConnect();
    for (const cat of pricing) {
      await Pricing.findOneAndUpdate(
        { category: cat.category },
        cat,
        { upsert: true, returnDocument: 'after' }
      );
    }
  } catch (error) {
    console.error("Failed to save pricing to MongoDB:", error);
  }
}
