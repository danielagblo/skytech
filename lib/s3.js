import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import sharp from "sharp";

export const s3Client = new S3Client({
  region: process.env.S3_REGION,
  endpoint: process.env.S3_ENDPOINT,
  forcePathStyle: true, // Critical for non-AWS S3 providers like Railway
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
  },
});

export async function processAndUpload(file) {
  const buffer = Buffer.from(await file.arrayBuffer());
  const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}.webp`;
  const key = `uploads/${filename}`;

  // 1. Optimize with Sharp (matches Tres Jolie logic)
  const optimizedBuffer = await sharp(buffer)
    .resize(1200, null, { withoutEnlargement: true })
    .webp({ quality: 75 })
    .toBuffer();

  // 2. Upload to S3
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: key,
    Body: optimizedBuffer,
    ContentType: "image/webp",
  }));

  // 3. Return the Proxy URL
  return `${process.env.NEXT_PUBLIC_BASE_URL}/api/images/${key}`;
}
