import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://skytechghana.com";
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/dashboard", "/login"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

