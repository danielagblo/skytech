import dbConnect from "./mongodb";
import Hero from "../models/Hero";

export interface HeroData {
  title: string;
  subtitle: string;
  imageUrl: string;
  updatedAt?: string | Date;
}

const DEFAULT_HERO: HeroData = {
  title: "World Class Software solutions for all businesses.",
  subtitle: "No 1# website development company in Ghana.",
  imageUrl: "/images/hero-3.png",
};

export async function getHeroData(): Promise<HeroData> {
  try {
    await dbConnect();
    const hero = await Hero.findOne({}).lean();
    
    if (!hero) {
      return DEFAULT_HERO;
    }
    
    return JSON.parse(JSON.stringify(hero));
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
