import type { MetadataRoute } from "next";
import {
  getAllInsightSlugs,
  getAllLocalityPaths,
  getAllPropertySlugs,
} from "@/lib/sanity/queries";
import { isLive, siteUrl } from "@/lib/env";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Nothing should be advertised to crawlers while the site is in preview.
  if (!isLive) return [];

  const [properties, insights, localities] = await Promise.all([
    getAllPropertySlugs(),
    getAllInsightSlugs(),
    getAllLocalityPaths(),
  ]);

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/properties`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/the-roar-standard`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/process`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/insights`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: `${siteUrl}/disclaimer`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  return [
    ...staticPages,
    ...properties.map((p) => ({
      url: `${siteUrl}/properties/${p.slug}`,
      lastModified: p.publishedAt ? new Date(p.publishedAt) : now,
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...localities.map((l) => ({
      url: `${siteUrl}/in/${l.city}/${l.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...insights.map((i) => ({
      url: `${siteUrl}/insights/${i.slug}`,
      lastModified: new Date(i.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
