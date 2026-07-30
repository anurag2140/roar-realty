import dynamicImport from "next/dynamic";

/**
 * Sanity Studio, embedded at /studio so the admin panel lives on the company's
 * own domain instead of a third-party URL.
 */

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

const StudioRoot = dynamicImport(() => import("@/components/studio/StudioRoot"));

export default function StudioPage() {
  return <StudioRoot />;
}
