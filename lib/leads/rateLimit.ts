import "server-only";

import { and, eq, lt, sql as raw } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimits } from "@/lib/db/schema";

/**
 * Fixed-window rate limiter backed by Postgres.
 *
 * Upstash Redis is the better tool, but it wasn't provisioned and this is a
 * lead form, not a login endpoint — a few requests of slop at a window
 * boundary costs nothing. Swapping in Redis later means replacing this one
 * function, nothing else.
 */
export async function checkRateLimit(
  key: string,
  { limit, windowSeconds }: { limit: number; windowSeconds: number }
): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();
  const windowStart = new Date(Math.floor(now / (windowSeconds * 1000)) * windowSeconds * 1000);

  try {
    // Atomic upsert: concurrent submissions increment the same row rather than
    // racing to create duplicates.
    const [row] = await db
      .insert(rateLimits)
      .values({ key, windowStart, count: 1 })
      .onConflictDoNothing({ target: [rateLimits.key, rateLimits.windowStart] })
      .returning();

    let count = row?.count ?? 0;

    if (!row) {
      const [updated] = await db
        .update(rateLimits)
        .set({ count: raw`${rateLimits.count} + 1` })
        .where(and(eq(rateLimits.key, key), eq(rateLimits.windowStart, windowStart)))
        .returning();
      count = updated?.count ?? limit + 1;
    }

    // Opportunistic sweep of expired windows — cheap, and saves a cron job.
    if (Math.random() < 0.05) {
      const cutoff = new Date(now - windowSeconds * 1000 * 4);
      await db.delete(rateLimits).where(lt(rateLimits.windowStart, cutoff));
    }

    return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
  } catch {
    // Never let a limiter outage block a genuine enquiry — losing a lead is
    // worse than accepting a duplicate.
    return { allowed: true, remaining: limit };
  }
}

/** Salted hash — we need to recognise repeat offenders, not identify people. */
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(`roar-realty:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
