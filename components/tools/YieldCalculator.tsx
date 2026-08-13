"use client";

import { useMemo, useState } from "react";
import { useEnquiry } from "@/components/popups/EnquiryProvider";

/**
 * Dubai net-yield calculator.
 *
 * The brand's whole argument is that the advertised yield and the money that
 * actually reaches you are different numbers. Rather than assert that, this
 * lets the visitor watch it happen with their own figures, then offers to have
 * it checked properly. The gap it exposes is the conversion event.
 */

const AED = new Intl.NumberFormat("en-AE", {
  style: "currency",
  currency: "AED",
  maximumFractionDigits: 0,
});

function Row({
  label,
  value,
  hint,
  tone = "default",
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "minus" | "total";
}) {
  return (
    <div
      className={`flex items-baseline justify-between gap-4 py-3 ${
        tone === "total" ? "border-t border-gold/25 pt-4" : "border-b border-gold/10"
      }`}
    >
      <span className="min-w-0">
        <span
          className={
            tone === "total"
              ? "text-[13px] tracking-[0.18em] text-gold uppercase"
              : "text-[14px] text-ivory/65"
          }
        >
          {label}
        </span>
        {hint && <span className="mt-0.5 block text-[11px] text-ivory/35">{hint}</span>}
      </span>
      <span
        className={
          tone === "total"
            ? "font-display text-[26px] whitespace-nowrap text-gold-hi"
            : tone === "minus"
              ? "text-[15px] whitespace-nowrap text-red-300/70"
              : "text-[15px] whitespace-nowrap text-ivory/80"
        }
      >
        {value}
      </span>
    </div>
  );
}

function Slider({
  label,
  value,
  set,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  value: number;
  set: (n: number) => void;
  min: number;
  max: number;
  step: number;
  suffix: string;
}) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[11px] tracking-[0.2em] text-ivory/50 uppercase">{label}</span>
        <span className="font-display text-lg text-gold-hi">
          {value.toLocaleString("en-AE")}
          {suffix}
        </span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="mt-2 h-2 w-full cursor-pointer appearance-none rounded-full bg-gold/20 accent-[var(--gold)]"
      />
    </label>
  );
}

export function YieldCalculator() {
  const { open } = useEnquiry();

  const [price, setPrice] = useState(1_500_000);
  const [rent, setRent] = useState(110_000);
  const [sizeSqft, setSizeSqft] = useState(850);
  const [serviceRate, setServiceRate] = useState(18); // AED per sq ft per year
  const [voidWeeks, setVoidWeeks] = useState(4);
  const [managementPct, setManagementPct] = useState(8);

  const calc = useMemo(() => {
    const gross = price > 0 ? (rent / price) * 100 : 0;

    const serviceCharge = sizeSqft * serviceRate;
    const voidCost = (rent / 52) * voidWeeks;
    const management = (rent * managementPct) / 100;
    // One month's rent is the usual Dubai letting commission, amortised yearly.
    const lettingFee = rent / 12;

    const deductions = serviceCharge + voidCost + management + lettingFee;
    const net = rent - deductions;
    const netYield = price > 0 ? (net / price) * 100 : 0;
    const gap = gross - netYield;

    return { gross, serviceCharge, voidCost, management, lettingFee, deductions, net, netYield, gap };
  }, [price, rent, sizeSqft, serviceRate, voidWeeks, managementPct]);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12">
      {/* Inputs */}
      <div className="flex flex-col gap-6">
        <Slider
          label="Purchase price"
          value={price}
          set={setPrice}
          min={400_000}
          max={10_000_000}
          step={50_000}
          suffix=" AED"
        />
        <Slider
          label="Advertised annual rent"
          value={rent}
          set={setRent}
          min={20_000}
          max={700_000}
          step={5_000}
          suffix=" AED"
        />
        <Slider
          label="Unit size"
          value={sizeSqft}
          set={setSizeSqft}
          min={350}
          max={6_000}
          step={25}
          suffix=" sq ft"
        />
        <Slider
          label="Service charge"
          value={serviceRate}
          set={setServiceRate}
          min={8}
          max={45}
          step={1}
          suffix=" AED / sq ft"
        />
        <Slider
          label="Empty between tenants"
          value={voidWeeks}
          set={setVoidWeeks}
          min={0}
          max={16}
          step={1}
          suffix=" weeks"
        />
        <Slider
          label="Property management"
          value={managementPct}
          set={setManagementPct}
          min={0}
          max={15}
          step={1}
          suffix="%"
        />

        <p className="text-[12px] leading-relaxed text-ivory/35">
          Service charges vary enormously between buildings, from around 12 AED
          per sq ft in simple towers to 40+ in amenity-heavy ones. If you
          don&apos;t know the figure for a specific building, that is itself
          worth finding out before you buy.
        </p>
      </div>

      {/* Output */}
      <div className="border border-gold/25 bg-ink-2 p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-baseline justify-between gap-3">
          <span className="text-[11px] tracking-[0.24em] text-gold uppercase">
            The brochure number
          </span>
          <span className="font-display text-[38px] leading-none text-ivory/70">
            {calc.gross.toFixed(1)}%
          </span>
        </div>

        <Row label="Annual rent" value={AED.format(rent)} />
        <Row
          label="Service charge"
          hint={`${sizeSqft.toLocaleString()} sq ft × ${serviceRate} AED`}
          value={`− ${AED.format(calc.serviceCharge)}`}
          tone="minus"
        />
        <Row
          label="Void periods"
          hint={`${voidWeeks} week${voidWeeks === 1 ? "" : "s"} vacant`}
          value={`− ${AED.format(calc.voidCost)}`}
          tone="minus"
        />
        <Row
          label="Management"
          hint={`${managementPct}% of rent`}
          value={`− ${AED.format(calc.management)}`}
          tone="minus"
        />
        <Row
          label="Letting commission"
          hint="One month, amortised"
          value={`− ${AED.format(calc.lettingFee)}`}
          tone="minus"
        />
        <Row label="What actually reaches you" value={AED.format(calc.net)} tone="total" />

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border border-gold/25 bg-gold/8 p-5">
          <div>
            <div className="text-[11px] tracking-[0.24em] text-gold uppercase">
              Real net yield
            </div>
            <div className="mt-1 font-display text-[44px] leading-none text-gold-hi">
              {calc.netYield.toFixed(1)}%
            </div>
          </div>
          <div className="text-right">
            <div className="text-[11px] tracking-[0.2em] text-ivory/45 uppercase">
              Gap vs advertised
            </div>
            <div className="mt-1 font-display text-2xl text-ivory/70">
              {calc.gap.toFixed(1)} points
            </div>
          </div>
        </div>

        {calc.net < 0 && (
          <p className="mt-4 border-l-2 border-red-400/60 bg-red-950/20 py-3 pl-4 text-[13px] leading-relaxed text-red-200/80">
            At these figures the property costs you money every year before any
            mortgage payment. That is not unusual for high-service-charge
            buildings bought on brochure yield.
          </p>
        )}

        <button
          type="button"
          onClick={() =>
            open({
              formType: "enquiry",
              title: "Have these numbers checked",
              description:
                "Send us the building and we'll come back with its actual service charge, real observed occupancy and what comparable units genuinely let for.",
              submitLabel: "Check my numbers →",
              messageLabel: "Which building or project?",
              messagePlaceholder: `Yield check: ${AED.format(price)} purchase, ${AED.format(rent)} rent, ${sizeSqft} sq ft…`,
            })
          }
          className="mt-6 w-full py-4 text-[13px] tracking-[0.22em] text-ink uppercase transition-all hover:brightness-110"
          style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
        >
          Have these numbers checked →
        </button>

        <p className="mt-3 text-center text-[11px] leading-relaxed text-ivory/35">
          Estimates only, based on the assumptions above. Real figures depend on
          the specific building.
        </p>
      </div>
    </div>
  );
}
