import { NextResponse, type NextRequest } from "next/server";
import { and, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { serverEnv } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Constant-time comparison so the password can't be recovered by timing. */
function safeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function authorize(req: NextRequest): NextResponse | null {
  const expected = serverEnv.leadsAdminPassword;
  if (!expected) {
    return NextResponse.json(
      { error: "LEADS_ADMIN_PASSWORD is not configured on the server." },
      { status: 503 }
    );
  }
  const supplied = req.headers.get("x-leads-password") || "";
  if (!safeEqual(supplied, expected)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET(req: NextRequest) {
  const denied = authorize(req);
  if (denied) return denied;

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status") || "all";
  const q = (searchParams.get("q") || "").trim();
  const limit = Math.min(Number(searchParams.get("limit")) || 200, 500);

  const conditions: SQL[] = [];
  if (status !== "all") conditions.push(eq(leads.status, status));
  if (q) {
    const like = `%${q}%`;
    const search = or(
      ilike(leads.name, like),
      ilike(leads.phone, like),
      ilike(leads.email, like),
      ilike(leads.propertyName, like),
      ilike(leads.message, like)
    );
    if (search) conditions.push(search);
  }

  try {
    const rows = await db
      .select()
      .from(leads)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(desc(leads.createdAt))
      .limit(limit);

    return NextResponse.json(
      { leads: rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("[GET /api/leads]", err);
    return NextResponse.json(
      { error: "Could not read leads. Has the database been initialised?" },
      { status: 500 }
    );
  }
}
