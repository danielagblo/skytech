import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
  endpoint: process.env.S3_ENDPOINT, // Added as requested
  forcePathStyle: true, // Often needed for custom endpoints
});

export async function processAndUpload(file: File, folder: string = "hero") {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}.webp`;
  const key = `${folder}/${filename}`;

  // 1. Optimize with Sharp (Hero specific settings)
  const optimizedBuffer = await sharp(buffer)
    .resize(1920, null, { withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  // 2. Upload to S3
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET || "",
    Key: key,
    Body: optimizedBuffer,
    ContentType: "image/webp",
  }));

  // 3. Return the Proxy URL
  return `/api/images/${key}`;
}

export async function deleteFromS3(url: string) {
  if (!url || !url.includes("/api/images/")) return;

  try {
    // Extract key from /api/images/[key]
    const key = url.split("/api/images/")[1];
    
    await s3Client.send(new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET || "",
      Key: key,
    }));
    console.log(`Deleted S3 object: ${key}`);
  } catch (error) {
    console.error("Failed to delete from S3:", error);
  }
}

