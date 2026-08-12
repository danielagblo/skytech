import sharp from "sharp";
import * as mysql from "./mysql";
import { processAndUpload as s3Upload, deleteFromS3 as s3Delete, getImageFromS3 } from "./s3";

export type ImageStorage = "s3" | "db";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function getImageStorage(): ImageStorage {
  const raw = (process.env.IMAGE_STORAGE || "s3").toLowerCase();
  return raw === "db" ? "db" : "s3";
}

export async function optimizeImage(
  buffer: Buffer,
  width = 1920,
  quality = 80,
): Promise<Buffer> {
  return sharp(buffer)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality })
    .toBuffer();
}

export type ImageMime = "image/webp";
const MIME: ImageMime = "image/webp";

async function uploadToDb(buffer: Buffer, folder = "uploads", keyPath?: string): Promise<string> {
  await mysql.initSchema();
  const id = await mysql.insert("images", {
    folder,
    mime: MIME,
    key_path: keyPath ?? null,
    data: buffer,
  });
  return `/api/images/${id}`;
}

export async function uploadImage(
  file: File,
  folder: string = "hero",
): Promise<string> {
  if (getImageStorage() === "db") {
    const buffer = Buffer.from(await file.arrayBuffer());
    const optimized = await optimizeImage(buffer);
    return uploadToDb(optimized);
  }
  return s3Upload(file, folder);
}

export async function deleteImage(url: string): Promise<void> {
  if (!url || !url.includes("/api/images/")) return;
  if (getImageStorage() === "db") {
    try {
      const idOrKey = url.split("/api/images/")[1];
      await mysql.initSchema();
      if (UUID_RE.test(idOrKey)) {
        await mysql.remove("images", idOrKey);
      } else {
        await mysql.query("DELETE FROM images WHERE key_path = ?", [idOrKey]);
      }
      console.log(`Deleted image from MySQL: ${idOrKey}`);
    } catch (error) {
      console.error("Failed to delete image from MySQL:", error);
    }
    return;
  }
  return s3Delete(url);
}

export async function getImageFromDb(idOrKey: string): Promise<{
  mime: string;
  data: Buffer;
} | null> {
  await mysql.initSchema();
  const isUuid = UUID_RE.test(idOrKey);
  const rows = isUuid
    ? await mysql.query(
        "SELECT id, mime, data FROM images WHERE id = ? LIMIT 1",
        [idOrKey],
      )
    : await mysql.query(
        "SELECT id, mime, data FROM images WHERE key_path = ? LIMIT 1",
        [idOrKey],
      );
  const row = rows[0];
  if (!row) return null;
  const data = row.data;
  return {
    mime: row.mime || MIME,
    data: Buffer.isBuffer(data) ? data : Buffer.from(data || []),
  };
}

// Tries the DB first, then falls back to S3 (for images stored before the switch).
export async function resolveImage(
  pathKey: string,
): Promise<{ mime: string; data: Buffer } | null> {
  const fromDb = await getImageFromDb(pathKey);
  if (fromDb) return fromDb;
  if (process.env.S3_BUCKET) {
    try {
      return await getImageFromS3(pathKey);
    } catch (error) {
      console.log(`S3 fallback miss for ${pathKey}`, String(error));
    }
  }
  return null;
}

export const isDbStorage = (): boolean => getImageStorage() === "db";