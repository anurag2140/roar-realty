import { NextResponse, type NextRequest } from "next/server";
import { getPropertiesByIds } from "@/lib/sanity/queries";

export const runtime = "nodejs";

/**
 * Resolves shortlist/compare ids into full property records.
 *
 * The shortlist lives in localStorage (no account required), so the server has
 * no idea what's in it until the client asks. Reads published content only —
 * nothing sensitive is exposed here.
 */
export async function GET(req: NextRequest) {
  const ids = (new URL(req.url).searchParams.get("ids") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 50);

  if (!ids.length) return NextResponse.json({ properties: [] });

  try {
    const properties = await getPropertiesByIds(ids);
    // Preserve the order the user saved them in.
    const order = new Map(ids.map((id, i) => [id, i]));
    properties.sort((a, b) => (order.get(a._id) ?? 0) - (order.get(b._id) ?? 0));

    return NextResponse.json(
      { properties },
      { headers: { "Cache-Control": "public, max-age=60" } }
    );
  } catch (err) {
    console.error("[GET /api/properties/by-ids]", err);
    return NextResponse.json({ error: "Lookup failed" }, { status: 500 });
  }
}
