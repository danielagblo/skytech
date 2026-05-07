import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://skytechghana.com";

  const routes = [
    "",
    "/site",
    "/site/about",
    "/site/services",
    "/site/contact",
    "/site/internship",
  ];

  const now = new Date();
  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: route === "" || route === "/site" ? 1 : 0.7,
  }));
}

