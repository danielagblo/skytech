import * as dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const {
  S3_REGION,
  S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY,
  S3_ENDPOINT,
  S3_BUCKET,
  MYSQL_HOST,
  MYSQL_PORT,
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

if (!S3_BUCKET || !MYSQL_HOST || !MYSQL_USER || !MYSQL_DATABASE) {
  console.error("Missing config. Required: S3_BUCKET, MYSQL_HOST, MYSQL_USER, MYSQL_DATABASE");
  process.exit(1);
}

const s3Client = new S3Client({
  region: S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID || "",
    secretAccessKey: S3_SECRET_ACCESS_KEY || "",
  },
  endpoint: S3_ENDPOINT,
  forcePathStyle: true,
});

const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: parseInt(MYSQL_PORT || "3306", 10),
  user: MYSQL_USER,
  password: MYSQL_PASSWORD || "",
  database: MYSQL_DATABASE,
  connectionLimit: 5,
});

// tables + columns that hold /api/images/... URLs
const TARGETS = [
  ["affiliates", "logo_url"],
  ["hero", "image_url"],
  ["blog_posts", "cover_image"],
  ["projects", "image"],
];

async function fetchFromS3(key) {
  const response = await s3Client.send(new GetObjectCommand({
    Bucket: S3_BUCKET,
    Key: key,
  }));
  const chunks = [];
  for await (const chunk of response.Body) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return {
    mime: response.ContentType || "image/webp",
    data: Buffer.concat(chunks),
  };
}

async function keyExists(key) {
  const [rows] = await pool.query(
    "SELECT id FROM images WHERE key_path = ? LIMIT 1",
    [key],
  );
  return rows.length > 0;
}

(async () => {
  const seen = new Set();
  let imported = 0;
  let skipped = 0;
  let failed = 0;

  try {
    await pool.query(
      "CREATE TABLE IF NOT EXISTS images (id CHAR(36) PRIMARY KEY, folder VARCHAR(100) DEFAULT 'misc', mime VARCHAR(50) DEFAULT 'image/webp', key_path VARCHAR(255) DEFAULT NULL, data LONGBLOB NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, KEY idx_images_key_path (key_path))",
    );

    for (const [table, column] of TARGETS) {
      let rows;
      try {
        [rows] = await pool.query(
          `SELECT \`${column}\` AS url FROM \`${table}\` WHERE \`${column}\` LIKE '/api/images/%'`,
        );
      } catch (e) {
        console.warn(`Skipping ${table}.${column}: ${e.message}`);
        continue;
      }
      for (const row of rows) {
        const url = row.url;
        const key = url.split("/api/images/")[1];
        if (!key || seen.has(key)) continue;
        seen.add(key);

        const exists = await keyExists(key);
        if (exists) {
          skipped++;
          continue;
        }
        try {
          const { mime, data } = await fetchFromS3(key);
          // keep the same URL shape by storing the s3 key in key_path
          await pool.query(
            "INSERT INTO images (id, folder, mime, key_path, data) VALUES (?, ?, ?, ?, ?)",
            [crypto.randomUUID(), "migrated", mime, key, data],
          );
          imported++;
          console.log(`Imported: ${key}`);
        } catch (e) {
          failed++;
          console.error(`Failed: ${key} — ${e.message}`);
        }
      }
    }

    console.log(`\nDone. imported=${imported} skipped=${skipped} failed=${failed}`);
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("Image migration failed:", error);
    process.exit(1);
  }
})();