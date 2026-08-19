import { isMysql } from "./db";
import * as mysql from "./mysql";
import dbConnect from "./mongodb";
import Hero from "../models/Hero";

export interface HeroStat {
  value: number;
  suffix: string;
  label: string;
  compact?: boolean;
}

export interface HeroHeadline {
  headline: string;
  headlineSub: string;
}

export type HeroHeadlineMode = "slide" | "typing";

export interface HeroData {
  title: string;
  subtitle: string;
  imageUrl: string;
  headline: string;
  headlineSub: string;
  headlines?: HeroHeadline[];
  headlineMode?: HeroHeadlineMode;
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
  headlines: [{ headline: "MANY YEARS", headlineSub: "IN OPERATION" }],
  headlineMode: "slide",
  subText: "For Website, Mobile App Development and SEO Growth",
  stats: [
    { value: 8, suffix: "+", label: "Years in Operation", compact: false },
    { value: 8, suffix: "+", label: "Satisfied Customers", compact: false },
    { value: 1000, suffix: "+", label: "Projects Completed", compact: true },
    { value: 4, suffix: "+", label: "Countries Served", compact: false },
  ],
};

async function getHeroDataMysql(): Promise<HeroData> {
  await mysql.initSchema();
  const rows = await mysql.query(
    "SELECT id, title, subtitle, image_url, headline, headline_sub, headlines, headline_mode, sub_text, stats, updated_at FROM hero ORDER BY updated_at DESC LIMIT 1",
  );
  const row = rows[0];
  if (!row) {
    return DEFAULT_HERO;
  }
  const stats = (mysql.parseJson(row.stats) as HeroStat[]) || [];
  const headlines = (mysql.parseJson(row.headlines) as HeroHeadline[]) || [];
  return {
    title: row.title ?? DEFAULT_HERO.title,
    subtitle: row.subtitle ?? DEFAULT_HERO.subtitle,
    imageUrl: row.image_url ?? DEFAULT_HERO.imageUrl,
    headline: row.headline ?? DEFAULT_HERO.headline,
    headlineSub: row.headline_sub ?? DEFAULT_HERO.headlineSub,
    headlines:
      Array.isArray(headlines) && headlines.length > 0
        ? headlines
        : [{ headline: row.headline ?? DEFAULT_HERO.headline, headlineSub: row.headline_sub ?? DEFAULT_HERO.headlineSub }],
    headlineMode: row.headline_mode || DEFAULT_HERO.headlineMode,
    subText: row.sub_text ?? DEFAULT_HERO.subText,
    stats: Array.isArray(stats) && stats.length > 0 ? stats : DEFAULT_HERO.stats,
    updatedAt: row.updated_at,
  };
}

async function saveHeroDataMysql(hero: Partial<HeroData>): Promise<void> {
  await mysql.initSchema();
  const existingRows = await mysql.query("SELECT id FROM hero LIMIT 1");
  const record = {
    title: hero.title ?? "",
    subtitle: hero.subtitle ?? "",
    image_url: hero.imageUrl ?? "",
    headline: hero.headline ?? "",
    headline_sub: hero.headlineSub ?? "",
    headlines: JSON.stringify(hero.headlines ?? []),
    headline_mode: hero.headlineMode ?? "slide",
    sub_text: hero.subText ?? "",
    stats: JSON.stringify(hero.stats ?? []),
    updated_at: new Date(),
  };
  if (existingRows.length > 0) {
    await mysql.update("hero", existingRows[0].id, record);
  } else {
    await mysql.insert("hero", record);
  }
}

export async function getHeroData(): Promise<HeroData> {
  if (isMysql()) {
    try {
      return await getHeroDataMysql();
    } catch (error) {
      console.error("Failed to read hero data from MySQL:", error);
      return DEFAULT_HERO;
    }
  }
  try {
    await dbConnect();
    const hero = await Hero.findOne({}).lean();
    
    if (!hero) {
      return DEFAULT_HERO;
    }
    
    const parsed = JSON.parse(JSON.stringify(hero));
    const merged = { ...DEFAULT_HERO, ...parsed };
    const headlines =
      Array.isArray(merged.headlines) && merged.headlines.length > 0
        ? merged.headlines
        : [{ headline: merged.headline, headlineSub: merged.headlineSub }];
    return {
      ...merged,
      headlines,
      stats: Array.isArray(merged.stats) && merged.stats.length > 0 ? merged.stats : DEFAULT_HERO.stats,
    };
  } catch (error) {
    console.error("Failed to read hero data from MongoDB:", error);
    return DEFAULT_HERO;
  }
}

export async function saveHeroData(hero: Partial<HeroData>): Promise<void> {
  if (isMysql()) {
    try {
      await saveHeroDataMysql(hero);
    } catch (error) {
      console.error("Failed to save hero data to MySQL:", error);
    }
    return;
  }
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