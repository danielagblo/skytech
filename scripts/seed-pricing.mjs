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

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing in .env");
  process.exit(1);
}

// Define Schema locally to avoid Next.js import issues in a raw node script
const PricingPackageSchema = new mongoose.Schema({
  name: String,
  tier: String,
  price: String,
  usd: String,
  renewal: String,
  interval: String,
  featured: Boolean,
  highlights: [String],
});

const PricingSchema = new mongoose.Schema({
  category: String,
  label: String,
  packages: [PricingPackageSchema],
  updatedAt: { type: Date, default: Date.now },
});

const Pricing = mongoose.models.Pricing || mongoose.model('Pricing', PricingSchema);

const pricingData = {
  web: {
    label: "Web Development",
    packages: [
      {
        name: "Basic Website Package",
        tier: "Startup",
        price: "2,500",
        usd: "175",
        renewal: "1,000",
        highlights: [
          "5-6 Page Responsive Site",
          "Basic SEO Optimization",
          "WhatsApp Integration",
          "1 Business Email Account",
          "12 Months Free Hosting & SSL",
          "6 Months Technical Support"
        ]
      },
      {
        name: "Standard Business Package",
        tier: "Growth",
        price: "6,500",
        usd: "450",
        renewal: "1,500",
        featured: true,
        highlights: [
          "10-12 High-Performance Pages",
          "Advanced SEO Engine",
          "Custom Contact Forms",
          "CMS/Blog Integration",
          "Google Business Profile Optimization",
          "Analytics Dashboard Access"
        ]
      },
      {
        name: "E-commerce/Booking Package",
        tier: "Retail",
        price: "25,000",
        usd: "1,725",
        renewal: "5,000",
        highlights: [
          "Full Online Store / Booking Hub",
          "Payment Gateway (Visa/Momo)",
          "Automated Stock Management",
          "Abandoned Cart Recovery",
          "5 Premium Business Emails",
          "Advanced Schema Optimization"
        ]
      },
      {
        name: "Premium Corporate Package",
        tier: "Enterprise",
        price: "45,000",
        usd: "3,105",
        renewal: "8,000",
        highlights: [
          "Unlimited System Pages",
          "Custom API/CRM Integrations",
          "Global SEO & Multilingual Support",
          "10 Premium Business Emails",
          "Dedicated Account Manager",
          "Lifetime Security Updates"
        ]
      }
    ]
  },
  mobile: {
    label: "Mobile Apps",
    packages: [
      {
        name: "Business Growth App",
        tier: "Standard",
        price: "24,000",
        usd: "1,655",
        renewal: "4,000",
        highlights: [
          "Android & iOS (8-12 Screens)",
          "Integrated Payment Gateway",
          "Real-time Push Notifications",
          "Centralized Admin Panel",
          "App Store Optimization (ASO)"
        ]
      },
      {
        name: "Enterprise App Suite",
        tier: "Advanced",
        price: "80,000",
        usd: "5,520",
        renewal: "12,000",
        featured: true,
        highlights: [
          "Full-Stack Dev (up to 25 Screens)",
          "Real-time Data Synchronization",
          "AWS/GCP Scalable Infrastructure",
          "Biometric/2FA Security",
          "6 Months Intensive Maintenance"
        ]
      },
      {
        name: "Marketplace & Fintech",
        tier: "Elite",
        price: "120,000",
        usd: "8,275",
        renewal: "20,000",
        highlights: [
          "Multi-Vendor Ecosystem Architecture",
          "In-App Digital Wallets",
          "Live GPS Logistics Tracking",
          "Bank-Grade Data Encryption",
          "Vendor Management Portal",
          "24/7 Premium Support Line"
        ]
      }
    ]
  },
  marketing: {
    label: "SEO & Growth",
    packages: [
      {
        name: "Silver SEO Plan",
        tier: "Essential",
        price: "1,500",
        usd: "105",
        renewal: "400",
        interval: "mo",
        highlights: [
          "Comprehensive Keyword Research",
          "On-Page Technical SEO",
          "Monthly Performance Reports",
          "Local Search Optimization",
          "Meta Data Hardening"
        ]
      },
      {
        name: "Gold SEO Plan",
        tier: "Professional",
        price: "3,500",
        usd: "245",
        renewal: "800",
        interval: "mo",
        featured: true,
        highlights: [
          "In-depth Competitor Analysis",
          "High-Authority Backlink Building",
          "Content Marketing Strategy",
          "Bi-Weekly Strategy Reviews",
          "Conversion Rate Optimization"
        ]
      },
      {
        name: "Platinum SEO Plan",
        tier: "Dominance",
        price: "7,500",
        usd: "520",
        renewal: "1,800",
        interval: "mo",
        highlights: [
          "Full Digital Presence Management",
          "4 Authority Blog Posts / Month",
          "Complete Technical SEO Audits",
          "Weekly Dedicated Strategy Calls",
          "Omni-channel Growth Consulting"
        ]
      }
    ]
  },
  branding: {
    label: "Creative Identity",
    packages: [
      {
        name: "Starter Branding",
        tier: "Identity",
        price: "1,200",
        usd: "85",
        renewal: "300",
        highlights: [
          "Custom Logo (2 Design Concepts)",
          "Professional Business Cards",
          "Social Media Profile Assets",
          "Basic Color Palette",
          "Typography Selection"
        ]
      },
      {
        name: "Business Identity",
        tier: "Corporate",
        price: "3,500",
        usd: "245",
        renewal: "800",
        featured: true,
        highlights: [
          "Custom Logo (4 Design Concepts)",
          "Comprehensive Brand Guidelines",
          "10 Custom Social Media Templates",
          "Full Company Profile Design",
          "Stationery System Design"
        ]
      },
      {
        name: "Master Enterprise",
        tier: "Elite",
        price: "8,000",
        usd: "555",
        renewal: "2,000",
        highlights: [
          "Custom UI/UX Design System",
          "Professional Logo Animation",
          "Full Marketing Collateral Suite",
          "Brand Voice & Messaging Guide",
          "High-Res Source Deliverables"
        ]
      }
    ]
  }
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
      await pool.query("DELETE FROM pricing");
      for (const [category, data] of Object.entries(pricingData)) {
        await pool.query(
          "INSERT INTO pricing (id, category, label, packages) VALUES (?, ?, ?, ?)",
          [newId(), category, data.label, JSON.stringify(data.packages)],
        );
        console.log(`Seeded category: ${category}`);
      }
      console.log("Pricing synchronization complete (MySQL).");
      await pool.end();
      process.exit(0);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB for seeding...");

    // Clear existing pricing
    await Pricing.deleteMany({});
    console.log("Cleared existing pricing data.");

    // Insert new data
    for (const [category, data] of Object.entries(pricingData)) {
      await Pricing.create({
        category,
        label: data.label,
        packages: data.packages
      });
      console.log(`Seeded category: ${category}`);
    }

    console.log("Pricing synchronization complete.");
    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
