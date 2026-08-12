import { s3Client } from "../../../lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getImageStorage, resolveImage } from "../../../lib/storage";

export async function GET(request, { params }) {
  const { path } = await params; // Next.js 15+ params are async
  const key = path.join("/");

  // DB-backed storage: URLs are /api/images/<id> (new) or /api/images/<s3-key> (legacy).
  // Resolve from the DB first, then fall back to S3 for legacy images.
  if (getImageStorage() === "db") {
    try {
      const image = await resolveImage(key);
      if (!image) {
        return new Response("Image not found", { status: 404 });
      }
      return new Response(new Uint8Array(image.data), {
        headers: {
          "Content-Type": image.mime,
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("DB image read error:", error);
      return new Response("Image not found", { status: 404 });
    }
  }

  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET,
      Key: key,
    });

    const response = await s3Client.send(command);

    // Convert S3 stream to a web-supported ReadableStream
    return new Response(response.Body, {
      headers: {
        "Content-Type": response.ContentType || "image/webp",
        // Aggressive caching (1 year) for production performance
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Image proxy error:", error);
    return new Response("Image not found", { status: 404 });
  }
}