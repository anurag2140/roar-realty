import type { MetadataRoute } from "next";
import { isLive, siteUrl } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  // Preview mode: refuse everything. This is the belt to the meta-robots
  // braces, so a stray crawler can't index sample listings.
  if (!isLive) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/studio",       // admin
          "/api/",         // no crawlable endpoints
          "/shortlist",    // per-device, no shared content
          "/thank-you",    // conversion page
          "/properties?",  // filtered permutations are near-duplicates
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
