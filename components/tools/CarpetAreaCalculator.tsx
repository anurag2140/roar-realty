"use client";

import { useMemo, useState } from "react";
import { useEnquiry } from "@/components/popups/EnquiryProvider";
import { formatNumber } from "@/lib/site";

/**
 * Carpet area vs super built-up.
 *
 * Two properties quoted at the same rate per square foot can hand you very
 * different amounts of usable space. This makes the loading factor visible in
 * rupees, which is the argument the brand makes in words everywhere else.
 */
export function CarpetAreaCalculator() {
  const { open } = useEnquiry();

  const [superArea, setSuperArea] = useState(1800);
  const [carpetArea, setCarpetArea] = useState(1150);
  const [ratePerSqft, setRatePerSqft] = useState(12000);

  const calc = useMemo(() => {
    const safeSuper = Math.max(superArea, 1);
    const loading = ((safeSuper - carpetArea) / safeSuper) * 100;
    const totalPrice = safeSuper * ratePerSqft;
    const realCarpetRate = carpetArea > 0 ? totalPrice / carpetArea : 0;
    const payingFor = totalPrice - carpetArea * ratePerSqft;
    return { loading, totalPrice, realCarpetRate, payingFor };
  }, [superArea, carpetArea, ratePerSqft]);

  const inr = (n: number) =>
    n >= 1e7
      ? `₹${(n / 1e7).toFixed(2)} Cr`
      : n >= 1e5
        ? `₹${(n / 1e5).toFixed(1)} L`
        : `₹${formatNumber(Math.round(n))}`;

  const field = (
    label: string,
    value: number,
    set: (n: number) => void,
    suffix: string
  ) => (
    <label className="block">
      <span className="text-[11px] tracking-[0.2em] text-ivory/50 uppercase">{label}</span>
      <span className="mt-2 flex items-center gap-2 border-b border-gold/30 focus-within:border-gold-hi">
        <input
          type="number"
          value={value}
          min={0}
          onChange={(e) => set(Math.max(0, Number(e.target.value)))}
          className="min-h-11 w-full border-0 bg-transparent py-2 font-display text-xl text-ivory outline-none"
        />
        <span className="shrink-0 text-[12px] text-ivory/40">{suffix}</span>
      </span>
    </label>
  );

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      <div className="flex flex-col gap-6">
        {field("Super built-up area", superArea, setSuperArea, "sq ft")}
        {field("Carpet area", carpetArea, setCarpetArea, "sq ft")}
        {field("Quoted rate", ratePerSqft, setRatePerSqft, "₹ / sq ft")}

        <p className="text-[12px] leading-relaxed text-ivory/35">
          Under RERA, carpet area must be disclosed for registered projects. If a
          seller will not give you the figure in writing, that refusal is the
          answer.
        </p>
      </div>

      <div className="border border-gold/25 bg-ink-2 p-6 sm:p-8">
        <div className="mb-6">
          <div className="text-[11px] tracking-[0.24em] text-gold uppercase">
            You are paying for
          </div>
          <div className="mt-2 flex items-baseline gap-3">
            <span className="font-display text-[52px] leading-none text-gold-hi">
              {calc.loading > 0 ? calc.loading.toFixed(0) : 0}%
            </span>
            <span className="text-[15px] text-ivory/55">
              you will never live in
            </span>
          </div>
        </div>

        <dl className="m-0 flex flex-col gap-0">
          <div className="flex items-baseline justify-between gap-4 border-b border-gold/10 py-3">
            <dt className="text-[14px] text-ivory/65">Total price</dt>
            <dd className="m-0 text-[15px] text-ivory/80">{inr(calc.totalPrice)}</dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-b border-gold/10 py-3">
            <dt className="text-[14px] text-ivory/65">
              Quoted rate
              <span className="mt-0.5 block text-[11px] text-ivory/35">
                on super built-up
              </span>
            </dt>
            <dd className="m-0 text-[15px] text-ivory/80">
              ₹{formatNumber(ratePerSqft)}
            </dd>
          </div>
          <div className="flex items-baseline justify-between gap-4 border-t border-gold/25 pt-4">
            <dt className="text-[13px] tracking-[0.18em] text-gold uppercase">
              Real rate on carpet
            </dt>
            <dd className="m-0 font-display text-[26px] whitespace-nowrap text-gold-hi">
              ₹{formatNumber(Math.round(calc.realCarpetRate))}
            </dd>
          </div>
        </dl>

        <div className="mt-6 border border-gold/25 bg-gold/8 p-5">
          <div className="text-[11px] tracking-[0.2em] text-ivory/45 uppercase">
            Cost of the space you don&apos;t get
          </div>
          <div className="mt-1 font-display text-[32px] leading-none text-ivory">
            {inr(calc.payingFor)}
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            open({
              formType: "enquiry",
              title: "Check this property properly",
              description:
                "Send us the project and we'll verify the RERA-registered carpet area against what you were quoted, along with title, mutation and encumbrance.",
              submitLabel: "Verify this property →",
              messageLabel: "Which project?",
              messagePlaceholder: `Carpet check: ${formatNumber(superArea)} super built-up vs ${formatNumber(carpetArea)} carpet…`,
            })
          }
          className="mt-6 w-full py-4 text-[13px] tracking-[0.22em] text-ink uppercase transition-all hover:brightness-110"
          style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
        >
          Verify this property →
        </button>
      </div>
    </div>
  );
}
