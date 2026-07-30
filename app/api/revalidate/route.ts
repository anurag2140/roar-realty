import { NextResponse, type NextRequest } from "next/server";
import { revalidateTag } from "next/cache";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Sanity webhook target — publishing in Studio updates the live site in
 * seconds instead of waiting out the hourly revalidate window.
 *
 * Configure in Sanity → API → Webhooks:
 *   URL:     https://roarrealty.in/api/revalidate
 *   Trigger: create, update, delete
 *   Filter:  _type in ["property","homepage","siteSettings","testimonial",
 *                      "insight","faq","locality","builder","teamMember"]
 *   Projection: {"_type": _type, "slug": slug.current}
 *   Secret:  the value of SANITY_REVALIDATE_SECRET
 */

function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function POST(req: NextRequest) {
  const secret = serverEnv.revalidateSecret;
  if (!secret) {
    return NextResponse.json(
      { error: "SANITY_REVALIDATE_SECRET is not configured." },
      { status: 503 }
    );
  }

  // Sanity sends the shared secret as a header; also accept ?secret= so the
  // endpoint can be smoke-tested from a browser.
  const supplied =
    req.headers.get("x-sanity-secret") ||
    req.nextUrl.searchParams.get("secret") ||
    "";
  if (supplied !== secret) return unauthorized();

  let body: { _type?: string; slug?: string } = {};
  try {
    body = await req.json();
  } catch {
    // An empty body is fine — fall back to a broad purge below.
  }

  const tags = new Set<string>();

  if (body._type) {
    tags.add(body._type);
    if (body.slug) tags.add(`${body._type}:${body.slug}`);
  } else {
    // No projection configured on the webhook: purge everything we tag.
    [
      "property",
      "homepage",
      "siteSettings",
      "testimonial",
      "insight",
      "faq",
      "locality",
      "builder",
      "teamMember",
    ].forEach((t) => tags.add(t));
  }

  // Next 16 requires a cache-life profile alongside the tag; "max" fully
  // invalidates the tagged entries rather than shortening their life.
  for (const tag of tags) revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: [...tags], at: Date.now() });
}
