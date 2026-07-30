import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, projectId, serverEnv } from "@/lib/env";

/**
 * Public read client. Uses Sanity's CDN, which is what the free plan's
 * 1M requests/month allowance is measured against — so every cached hit here
 * costs us nothing extra.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  perspective: "published",
});

/** Bypasses the CDN and can see drafts. Server-only. */
export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: "drafts",
  token: serverEnv.sanityReadToken,
});

/** Write access — used by the seed script only. Never import into a route. */
export function getWriteClient() {
  return createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: serverEnv.sanityWriteToken,
  });
}

type FetchOptions = {
  /** Cache tags so a Sanity webhook can invalidate exactly what changed. */
  tags?: string[];
  /** Seconds. Defaults to an hour; the webhook is the real freshness mechanism. */
  revalidate?: number;
};

/**
 * Single entry point for all content reads.
 *
 * Every call is tagged so `/api/revalidate` can purge precisely the affected
 * pages when an editor hits Publish, rather than waiting out a TTL.
 */
export async function sanityFetch<T>(
  query: string,
  params: QueryParams = {},
  { tags = [], revalidate = 3600 }: FetchOptions = {}
): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
