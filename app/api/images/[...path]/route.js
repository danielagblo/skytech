import { s3Client } from "../../../lib/s3";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(request, { params }) {
  const { path } = await params; // Next.js 15+ params are async
  const key = path.join("/");

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
