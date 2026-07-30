import type { GlassFile } from "@/lib/sanity/types";

/**
 * The brand's core differentiator, made visual.
 *
 * Unverified items are shown as explicitly *not* checked rather than hidden —
 * a due-diligence panel that only ever shows green ticks tells the buyer
 * nothing, and would be the exact opacity the company positions itself against.
 */
export function GlassFilePanel({ glassFile }: { glassFile?: GlassFile }) {
  const g = glassFile ?? {};

  const checks: { label: string; done: boolean; detail?: string }[] = [
    {
      label: "Title chain verified",
      done: Boolean(g.titleChainYears),
      detail: g.titleChainYears ? `${g.titleChainYears} years` : undefined,
    },
    { label: "Independent litigation scan", done: Boolean(g.litigationScan) },
    { label: "Encumbrance certificate checked", done: Boolean(g.encumbranceChecked) },
    { label: "Outstanding dues confirmed clear", done: Boolean(g.duesCleared) },
    { label: "Builder track record reviewed", done: Boolean(g.builderRecordChecked) },
    {
      label: "RERA cross-check",
      done: Boolean(g.reraVerified),
      detail: g.reraNumber || undefined,
    },
  ];

  const complete = checks.filter((c) => c.done).length;

  return (
    <section
      aria-labelledby="glass-file-heading"
      className="border border-gold/25 bg-ink-2"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-gold/20 px-6 py-5">
        <h2 id="glass-file-heading" className="m-0 font-display text-2xl text-ivory">
          The Glass File
        </h2>
        <span className="text-[11px] tracking-[0.22em] text-gold uppercase">
          {complete} of {checks.length} verified
        </span>
      </div>

      <ul className="m-0 grid list-none gap-px bg-gold/12 p-0 sm:grid-cols-2">
        {checks.map((c) => (
          <li key={c.label} className="flex items-start gap-3 bg-ink-2 px-6 py-4">
            <span
              aria-hidden
              className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
                c.done
                  ? "bg-gold text-ink"
                  : "border border-dashed border-ivory/25 text-ivory/30"
              }`}
            >
              {c.done ? "✓" : "–"}
            </span>
            <span className="min-w-0">
              <span className={`block text-sm ${c.done ? "text-ivory/85" : "text-ivory/40"}`}>
                {c.label}
                <span className="sr-only">{c.done ? " — verified" : " — not yet verified"}</span>
              </span>
              {c.detail && (
                <span className="mt-0.5 block text-xs text-gold/70">{c.detail}</span>
              )}
            </span>
          </li>
        ))}
      </ul>

      <p className="border-t border-gold/15 px-6 py-4 text-xs leading-relaxed text-ivory/40">
        The complete file — documents, dates and the underlying searches — is
        sent to you before you commit to anything. Ask for it; there is no
        charge and no obligation.
      </p>
    </section>
  );
}
