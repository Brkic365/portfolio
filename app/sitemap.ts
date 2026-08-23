import type { MetadataRoute } from "next";

const siteUrl = "https://antoniobrkic.com";

const projects = [
  "stolarija-bm",
  "stocks-royale",
  "pentix",
  "route-master",
  "runtime",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 1,
    },
    ...projects.map((slug) => ({
      url: `${siteUrl}/work/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
