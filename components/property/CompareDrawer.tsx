"use client";

import Link from "next/link";
import { useShortlist } from "@/components/shortlist/ShortlistProvider";
import { MAX_COMPARE } from "@/lib/site";

/**
 * Slim bar that appears once two or more properties are marked for comparison.
 * The full side-by-side table lives on /shortlist.
 */
export function CompareDrawer() {
  const { compareIds, clearCompare, ready } = useShortlist();

  if (!ready || compareIds.length === 0) return null;

  return (
    <div className="roar-no-print fixed inset-x-0 bottom-16 z-1100 flex justify-center px-4 sm:bottom-6">
      <div className="flex w-full max-w-lg items-center gap-4 border border-gold/30 bg-ink-2/95 px-5 py-3.5 backdrop-blur-md">
        <span className="text-[12px] tracking-[0.18em] text-ivory/60 uppercase">
          {compareIds.length} of {MAX_COMPARE} to compare
        </span>
        <div className="ml-auto flex items-center gap-3">
          <button
            type="button"
            onClick={clearCompare}
            className="text-[11px] tracking-[0.18em] text-ivory/45 uppercase hover:text-gold-hi"
          >
            Clear
          </button>
          <Link
            href="/shortlist#compare"
            className="px-4 py-2.5 text-[11px] tracking-[0.2em] text-ink uppercase no-underline"
            style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
          >
            Compare →
          </Link>
        </div>
      </div>
    </div>
  );
}
