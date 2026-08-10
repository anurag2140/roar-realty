/**
 * Visible placeholder for business details that haven't been supplied yet.
 *
 * The prototype shipped invented values (`+91 98100 00000`,
 * `HRERA-GGM-XXXX-2026`). A fake phone number that looks real is worse than an
 * obvious gap — it gets published, and nobody notices until a buyer dials it.
 */
export function TBC({ children }: { children: React.ReactNode }) {
  return (
    <span
      title="Not yet supplied, add it in Studio → Site settings"
      className="inline-flex items-center gap-1.5 border border-dashed border-gold/40 px-2 py-0.5 text-[11px] tracking-[0.14em] text-gold/70 uppercase"
    >
      <span aria-hidden>⚠</span>
      {children}
    </span>
  );
}
