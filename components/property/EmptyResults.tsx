"use client";

import { LeadForm } from "@/components/forms/LeadForm";

/**
 * An empty search is the highest-intent moment on the site: someone told us
 * exactly what they want and we don't have it. So this converts rather than
 * apologising — the brief is pre-filled from their own filters.
 */
export function EmptyResults({ summary }: { summary: string }) {
  return (
    <div className="mx-auto max-w-2xl border border-gold/20 bg-ink-2 px-6 py-12 text-center sm:px-12 sm:py-16">
      <div className="mb-4 font-serif text-[30px] italic text-gold">
        Nothing matches, yet.
      </div>
      <p className="mx-auto mb-8 max-w-md text-[15px] leading-relaxed text-ivory/55">
        We don&apos;t pad shortlists with near-misses. Tell us what you&apos;re after
        and we&apos;ll go and find it, most of our best deals never reach a public
        listing page.
      </p>

      <div className="mx-auto max-w-sm text-left">
        <LeadForm
          formType="enquiry"
          showBudget
          messageLabel="What are you looking for?"
          messagePlaceholder={
            summary ? `Looking for ${summary}…` : "A 4BHK on Golf Course Road, ready to move…"
          }
          submitLabel="Find it for me →"
          successHeading="On it."
          successBody={"We're already looking.\nExpect a shortlist within 48 hours."}
        />
      </div>
    </div>
  );
}
