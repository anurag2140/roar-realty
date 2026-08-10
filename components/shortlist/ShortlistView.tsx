"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useShortlist } from "./ShortlistProvider";
import { PropertyCard } from "@/components/property/PropertyCard";
import { LeadForm } from "@/components/forms/LeadForm";
import { ButtonLink } from "@/components/ui/Button";
import { formatArea, formatPriceCr } from "@/lib/site";
import type { Property } from "@/lib/sanity/types";

export function ShortlistView() {
  const { ids, compareIds, ready, clear } = useShortlist();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const allIds = Array.from(new Set([...ids, ...compareIds]));

  // Fetches the saved ids from the API once the provider has hydrated.
  useEffect(() => {
    if (!ready) return;
    if (!allIds.length) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setProperties([]);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    fetch(`/api/properties/by-ids?ids=${allIds.join(",")}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setProperties(d.properties ?? []);
      })
      .catch(() => {
        if (!cancelled) setProperties([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, allIds.join(",")]);

  const saved = properties.filter((p) => ids.includes(p._id));
  const comparing = properties.filter((p) => compareIds.includes(p._id));

  if (!ready || loading) {
    return (
      <div className="mx-auto max-w-[1400px] px-5 pb-24 lg:px-10">
        <p className="text-ivory/40">Loading your shortlist…</p>
      </div>
    );
  }

  if (!saved.length && !comparing.length) {
    return (
      <div className="mx-auto max-w-2xl px-5 pb-24 text-center lg:px-10">
        <div className="border border-gold/20 bg-ink-2 px-6 py-16">
          <div className="mb-4 font-serif text-[28px] italic text-gold">Nothing saved yet.</div>
          <p className="mx-auto mb-8 max-w-sm text-[15px] leading-relaxed text-ivory/55">
            Tap the heart on any property to keep it here. Your shortlist is stored
            on this device only, nothing is sent to us until you ask.
          </p>
          <ButtonLink href="/properties" size="lg">
            Browse properties →
          </ButtonLink>
        </div>
      </div>
    );
  }

  const rows: { label: string; get: (p: Property) => string }[] = [
    { label: "Price", get: (p) => (p.priceOnRequest ? "On request" : formatPriceCr(p.priceCr)) },
    { label: "Type", get: (p) => p.propertyType || "Not stated" },
    {
      label: "Location",
      get: (p) => [p.locality, p.city].filter(Boolean).join(", ") || "Not stated",
    },
    { label: "Bedrooms", get: (p) => (p.bedrooms ? `${p.bedrooms} BHK` : "Not stated") },
    {
      label: "Carpet area",
      get: (p) => (p.carpetArea ? formatArea(p.carpetArea, p.areaUnit) : "Not stated"),
    },
    {
      label: "Plot area",
      get: (p) => (p.plotArea ? formatArea(p.plotArea, p.areaUnit) : "Not stated"),
    },
    {
      label: "Possession",
      get: (p) => p.possessionDate || p.possessionStatus || "Not stated",
    },
    { label: "Escrow", get: (p) => (p.escrowProtected ? "Protected" : "Not applicable") },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-5 pb-24 lg:px-10 lg:pb-32">
      {saved.length > 0 && (
        <>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <span className="text-[13px] text-ivory/45">
              {saved.length} saved {saved.length === 1 ? "property" : "properties"}
            </span>
            <button
              type="button"
              onClick={clear}
              className="text-[12px] tracking-[0.2em] text-ivory/45 uppercase underline underline-offset-4 hover:text-gold-hi"
            >
              Clear shortlist
            </button>
          </div>

          <div className="grid grid-cols-[repeat(auto-fill,minmax(min(320px,100%),1fr))] gap-6.5">
            {saved.map((p) => (
              <PropertyCard key={p._id} property={p} />
            ))}
          </div>
        </>
      )}

      {comparing.length > 1 && (
        <section id="compare" className="mt-20 scroll-mt-28">
          <h2 className="mb-6 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] text-ivory">
            Side by side.
          </h2>
          <div className="roar-scrollbar overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse border border-gold/20 text-left">
              <thead>
                <tr>
                  <th scope="col" className="w-40 border-b border-gold/20 px-5 py-4" />
                  {comparing.map((p) => (
                    <th
                      key={p._id}
                      scope="col"
                      className="border-b border-l border-gold/20 px-5 py-4 font-display text-lg font-normal text-ivory"
                    >
                      <Link
                        href={`/properties/${p.slug}`}
                        className="no-underline hover:text-gold-hi"
                      >
                        {p.name}
                      </Link>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-gold/12 last:border-b-0">
                    <th
                      scope="row"
                      className="px-5 py-3.5 text-[11px] font-normal tracking-[0.2em] text-gold uppercase"
                    >
                      {row.label}
                    </th>
                    {comparing.map((p) => (
                      <td
                        key={p._id}
                        className="border-l border-gold/12 px-5 py-3.5 text-[15px] text-ivory/70"
                      >
                        {row.get(p)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="mx-auto mt-20 max-w-lg border border-gold/25 bg-ink-2 p-8 sm:p-10">
        <h2 className="mb-2 font-display text-2xl text-ivory">
          Send us the whole list.
        </h2>
        <p className="mb-6 text-sm leading-relaxed text-ivory/55">
          We&apos;ll come back with a Glass File for each, title chain, dues,
          litigation scan and builder record, plus an honest view on which one
          we&apos;d actually buy.
        </p>
        <LeadForm
          formType="shortlist"
          submitLabel="Send my shortlist →"
          messageLabel="Anything we should know?"
          messagePlaceholder={
            saved.length
              ? `Interested in: ${saved.map((p) => p.name).join(", ")}`
              : "Tell us what matters most…"
          }
          successHeading="Received."
          successBody={"We're pulling the files together now.\nExpect them within 48 hours."}
        />
      </section>
    </div>
  );
}
