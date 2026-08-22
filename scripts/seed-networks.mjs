import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

const mysqlMod = await import('../app/lib/mysql.ts');
const SCHEMA = mysqlMod.SCHEMA ?? mysqlMod.default?.SCHEMA ?? [];
const newId = mysqlMod.newId ?? mysqlMod.default?.newId;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const {
  MONGODB_URI,
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_BUCKET,
  NEXT_PUBLIC_BASE_URL,
  IMAGE_STORAGE,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}

// Setup S3 Client
const s3Client = new S3Client({
  region: S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID || "",
    secretAccessKey: S3_SECRET_ACCESS_KEY || "",
  },
  endpoint: S3_ENDPOINT,
  forcePathStyle: true,
});

// Affiliate Schema
const AffiliateSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  order: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Affiliate = mongoose.models.Affiliate || mongoose.model("Affiliate", AffiliateSchema);


const partnersToSeed = [
  { name: "Accord Industrial Services", file: "clients/accord-industrial.png" },
  { name: "Atlas Rent-A-Car", file: "clients/atlas-rent-a-car.png" },
  { name: "Star Pace Car Rental", file: "clients/star-pace.png" },
  { name: "Kambel Consult", file: "clients/kambel-consult.png" },
  { name: "Bricsky", file: "clients/bricsky.png" },
  { name: "Très Jolie", file: "clients/tres-jolie.png" },
  { name: "Finlays", file: "clients/finlays.png" },
  { name: "Gold Recovery Ghana", file: "partners/gold-recovery-ghana.jpg" },
  { name: "GHACEM", file: "partners/ghacem.png" },
  { name: "Flour Mills of Ghana", file: "partners/flour-mills-ghana.png" },
  { name: "Bunge Loders Croklaan", file: "partners/bunge-loders-croklaan.jpg" },
  { name: "Afrotropic Cocoa", file: "partners/afrotropic-cocoa.jpg" },
  { name: "Cocoa Touton", file: "partners/cocoa-touton.png" },
  { name: "Meridian Port Services", file: "partners/meridian-port-services.jpg" },
  { name: "GB Foods", file: "partners/gb-foods.png" },
  { name: "SGS Laboratory", file: "partners/sgs-laboratory.png" },
  { name: "VRA", file: "partners/vra.png" },
  { name: "Dzata Cement", file: "partners/dzata-cement.png" },
  { name: "GPHA", file: "partners/gpha.png" },
  { name: "PSC Tema Shipyard", file: "partners/psc-tema-shipyard.png" },
  { name: "Accra Marriott", file: "partners/accra-marriott.png" },
  { name: "Contracta", file: "partners/contracta.jpg" },
];

async function uploadToS3(filePath, partnerName) {
  const buffer = fs.readFileSync(filePath);
  const ext = path.extname(filePath).toLowerCase();
  const filename = `${Date.now()}-${partnerName.toLowerCase().replace(/\s+/g, "-")}.webp`;
  const key = `partners/${filename}`;

  console.log(`Optimizing and uploading ${partnerName} (${key})...`);

  const optimizedBuffer = await sharp(buffer)
    .resize(400, null, { withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer();

  await s3Client.send(new PutObjectCommand({
    Bucket: S3_BUCKET || "",
    Key: key,
    Body: optimizedBuffer,
    ContentType: "image/webp",
  }));

  return `/api/images/${key}`;
}

async function seed() {
  try {
    const useDbImages = (IMAGE_STORAGE || "s3") === "db";

    if (process.env.DB_TYPE === "mysql") {
      const pool = mysql.createPool({
        host: MYSQL_HOST || "localhost",
        port: parseInt(MYSQL_PORT || "3306", 10),
        user: MYSQL_USER || "root",
        password: MYSQL_PASSWORD || "",
        database: MYSQL_DATABASE || "skytech",
      });
      for (const ddl of SCHEMA) {
        await pool.query(ddl);
      }
      await pool.query("DELETE FROM affiliates");

      let idx = 0;
      for (const partner of partnersToSeed) {
        const localPath = path.join(__dirname, '../public/images', partner.file);
        if (!fs.existsSync(localPath)) {
          console.warn(`File not found: ${localPath}`);
          continue;
        }

        let logoUrl;
        if (useDbImages) {
          const buffer = fs.readFileSync(localPath);
          const optimized = await sharp(buffer)
            .resize(400, null, { withoutEnlargement: true })
            .webp({ quality: 85 })
            .toBuffer();
          const id = newId();
          await pool.query(
            "INSERT INTO images (id, folder, mime, data) VALUES (?, ?, ?, ?)",
            [id, "partners", "image/webp", Buffer.from(optimized)],
          );
          logoUrl = `/api/images/${id}`;
        } else {
          logoUrl = await uploadToS3(localPath, partner.name);
        }

        await pool.query(
          "INSERT INTO affiliates (id, name, logo_url, sort_order) VALUES (?, ?, ?, ?)",
          [newId(), partner.name, logoUrl, idx],
        );
        console.log(`Seeded partner: ${partner.name} (${logoUrl})`);
        idx++;
      }
      console.log("Partners seeded to MySQL.");
      await pool.end();
      process.exit(0);
    }

    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    const seededPartners = [];

    for (const partner of partnersToSeed) {
      const localPath = path.join(__dirname, '../public/images', partner.file);
      if (fs.existsSync(localPath)) {
        const s3Url = await uploadToS3(localPath, partner.name);
        seededPartners.push({
          name: partner.name,
          logoUrl: s3Url
        });
      } else {
        console.warn(`File not found: ${localPath}`);
      }
    }

    if (seededPartners.length > 0) {
      await Affiliate.deleteMany({});
      await Affiliate.insertMany(seededPartners.map((p, idx) => ({ ...p, order: idx })));
      console.log(`Successfully seeded ${seededPartners.length} partners to the dedicated Affiliate collection.`);
    } else {
      console.log("No partners found to seed.");
    }

    process.exit(0);
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
}

seed();
