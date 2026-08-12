import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

const mysqlMod = await import('../app/lib/mysql.ts');
const SCHEMA = mysqlMod.SCHEMA ?? mysqlMod.default?.SCHEMA ?? [];
const newId = mysqlMod.newId ?? mysqlMod.default?.newId;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

// Define Schema locally to avoid Next.js import issues in a raw node script
const HeroStatSchema = new mongoose.Schema({
  value: Number,
  suffix: String,
  label: String,
  compact: Boolean,
});

const HeroSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  imageUrl: String,
  headline: String,
  headlineSub: String,
  subText: String,
  stats: [HeroStatSchema],
  updatedAt: { type: Date, default: Date.now },
});

const Hero = mongoose.models.Hero || mongoose.model('Hero', HeroSchema);

const heroData = {
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

async function seed() {
  try {
    if (process.env.DB_TYPE === "mysql") {
      const pool = mysql.createPool({
        host: process.env.MYSQL_HOST || "localhost",
        port: parseInt(process.env.MYSQL_PORT || "3306", 10),
        user: process.env.MYSQL_USER || "root",
        password: process.env.MYSQL_PASSWORD || "",
        database: process.env.MYSQL_DATABASE || "skytech",
      });
      for (const ddl of SCHEMA) {
        await pool.query(ddl);
      }
      await pool.query("DELETE FROM hero");
      await pool.query(
        "INSERT INTO hero (id, title, subtitle, image_url, headline, headline_sub, sub_text, stats) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [newId(), heroData.title, heroData.subtitle, heroData.imageUrl, heroData.headline, heroData.headlineSub, heroData.subText, JSON.stringify(heroData.stats)],
      );
      console.log("Seeded hero data to MySQL.");
      await pool.end();
      process.exit(0);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing hero
    await Hero.deleteMany({});
    console.log("Cleared existing hero data.");

    await Hero.create(heroData);
    console.log("Seeded hero data:", JSON.stringify(heroData, null, 2));

    console.log("Hero synchronization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
