import dbConnect from "./mongodb";
import Hero from "../models/Hero";

export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
  compact?: boolean;
}

export interface HeroData {
  title: string;
  subtitle: string;
  imageUrl: string;
  headline: string;
  headlineSub: string;
  subText: string;
  stats: HeroStat[];
  updatedAt?: string | Date;
}

export const DEFAULT_HERO: HeroData = {
  title: "World Class Software solutions for all businesses.",
  subtitle: "No 1# website development company in Ghana.",
  imageUrl: "/images/images/homePageBannerImage.png",
  headline: "MANY YEARS",
  headlineSub: "IN OPERATION",
  subText: "For Website, Mobile App Development and SEO Growth",
  stats: [
    { value: 8, suffix: "+", label: "Years in Operation", compact: false },
    { value: 8, suffix: "+", label: "Satisfied Customers", compact: false },
    { value: 1000, suffix: "+", label: "Projects Completed", compact: true },
    { value: 4, suffix: "+", label: "Countries Served", compact: false },
  ],
};

export async function getHeroData(): Promise<HeroData> {
  try {
    await dbConnect();
    const hero = await Hero.findOne({}).lean();
    
    if (!hero) {
      return DEFAULT_HERO;
    }
    
    const parsed = JSON.parse(JSON.stringify(hero));
    return {
      ...DEFAULT_HERO,
      ...parsed,
      stats: Array.isArray(parsed.stats) && parsed.stats.length > 0 ? parsed.stats : DEFAULT_HERO.stats,
    };
  } catch (error) {
    console.error("Failed to read hero data from MongoDB:", error);
    return DEFAULT_HERO;
  }
}

export async function saveHeroData(hero: Partial<HeroData>): Promise<void> {
  try {
    await dbConnect();
    await Hero.findOneAndUpdate(
      {},
      { ...hero, updatedAt: new Date() },
      { upsert: true, returnDocument: 'after' }
    );
  } catch (error) {
    console.error("Failed to save hero data to MongoDB:", error);
  }
}
