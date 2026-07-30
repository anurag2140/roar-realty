"use client";

import { NextStudio } from "next-sanity/studio";
import config from "@/sanity.config";

/**
 * Client boundary for the Studio.
 *
 * `sanity` must not be imported from a Server Component: Next resolves its
 * dependency `swr` through the `react-server` export condition there, which
 * has no default export, and the build fails. Keeping the config import on
 * this side of the boundary keeps the whole Studio out of the RSC graph.
 */
export default function StudioRoot() {
  return <NextStudio config={config} />;
}
