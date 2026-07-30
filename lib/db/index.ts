import "server-only";

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { serverEnv } from "@/lib/env";
import * as schema from "./schema";

/**
 * Neon over HTTP — one round trip per query, no connection pool to exhaust.
 * That matters on serverless, where a pooled driver leaks connections across
 * cold starts and eventually hits Neon's limit.
 */
const sql = neon(serverEnv.databaseUrl);

export const db = drizzle(sql, { schema });
export { schema };
