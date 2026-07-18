import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://anupvarghese.com",
      lastModified: new Date("2026-07-17"),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: "https://anupvarghese.com/contact",
      lastModified: new Date("2026-07-17"),
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
