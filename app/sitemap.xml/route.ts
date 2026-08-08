import { NextResponse } from "next/server";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const baseUrl = "https://skytechghana.com";

  const routes = [
    "",
    "/about",
    "/services",
    "/services/security-systems",
    "/seo",
    "/pricing",
    "/insights",
    "/gallery",
    "/case-studies",
    "/faqs",
    "/internship",
    "/contact",
    "/sitemap",
    "/privacy-policy",
    "/terms-of-use",
  ];

  const today = new Date().toISOString().split("T")[0];

  const urls = routes
    .map((route) => {
      const priority = route === "" ? "1.0" : "0.7";
      return `  <url>\n    <loc>${escapeXml(`${baseUrl}${route}`)}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=86400",
    },
  });
}