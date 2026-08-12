import { isMysql } from "./db";
import * as mysql from "./mysql";
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

async function getPricingMysql(): Promise<PricingCategory[]> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, category, label, packages, updated_at FROM pricing ORDER BY category ASC",
  );
  if (!rows || rows.length === 0) {
    return DEFAULT_PRICING;
  }
  return rows.map((r) => ({
    _id: r.id,
    category: r.category,
    label: r.label || "",
    packages: (mysql.parseJson(r.packages) || []) as PricingPackage[],
    updatedAt: r.updated_at,
  }));
}

async function savePricingMysql(pricing: PricingCategory[]): Promise<void> {
  await mysql.initSchema();
  for (const cat of pricing) {
    const existingRows = await mysql.query(
      "SELECT id FROM pricing WHERE category = ? LIMIT 1",
      [cat.category],
    );
    const record = {
      category: cat.category,
      label: cat.label || "",
      packages: JSON.stringify(cat.packages || []),
      updated_at: new Date(),
    };
    if (existingRows.length > 0) {
      await mysql.update("pricing", existingRows[0].id, record);
    } else {
      await mysql.insert("pricing", record);
    }
  }
}

export async function getPricing(): Promise<PricingCategory[]> {
  if (isMysql()) {
    try {
      return await getPricingMysql();
    } catch (error) {
      console.error("Failed to fetch pricing from MySQL:", error);
      return DEFAULT_PRICING;
    }
  }
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
  if (isMysql()) {
    try {
      await savePricingMysql(pricing);
    } catch (error) {
      console.error("Failed to save pricing to MySQL:", error);
    }
    return;
  }
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