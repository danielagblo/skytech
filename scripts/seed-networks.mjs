import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

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
  NEXT_PUBLIC_BASE_URL
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

// Settings Schema
const SettingsSchema = new mongoose.Schema({
  partners: [
    {
      name: String,
      logoUrl: String,
    },
  ],
}, { strict: false });

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);

const partnersToSeed = [
  { name: "Atlas Rent-A-Car", file: "Logo-DPCrdneV.png" },
  { name: "K-Consult", file: "k-logo.png" },
  { name: "Favicon Group", file: "favicon (1).png" },
  { name: "Skytech Global", file: "logo.png" },
  { name: "Skytech WebP", file: "logo.webp" },
  { name: "Main Favicon", file: "favicon.png" },
  { name: "Transparent Corp", file: "logo-transparent.png" },
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
      await Settings.findOneAndUpdate(
        {},
        { partners: seededPartners },
        { upsert: true, new: true }
      );
      console.log(`Successfully seeded ${seededPartners.length} partners to MongoDB and S3.`);
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
