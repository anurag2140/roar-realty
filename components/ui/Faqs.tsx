import type { Faq } from "@/lib/sanity/types";

/**
 * Native <details>/<summary> accordion — keyboard accessible, works without
 * JavaScript, and Google can read the answers for the FAQ rich result.
 */
export function Faqs({ items }: { items: Faq[] }) {
  if (!items.length) return null;

  return (
    <div className="border-t border-gold/15">
      {items.map((f) => (
        <details key={f._id} className="group border-b border-gold/15">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display text-lg text-ivory transition-colors hover:text-gold-hi [&::-webkit-details-marker]:hidden">
            {f.question}
            <span
              aria-hidden
              className="shrink-0 text-xl text-gold transition-transform group-open:rotate-45"
            >
              +
            </span>
          </summary>
          <p className="pb-6 text-[15px] leading-[1.8] text-ivory/60">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}
