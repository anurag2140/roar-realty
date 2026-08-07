"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import {
  AMENITIES,
  BEDROOM_OPTIONS,
  POSSESSION_STATUSES,
  PRICE_BANDS,
  PROPERTY_TYPES,
  SORT_OPTIONS,
} from "@/lib/site";
import { Modal } from "@/components/ui/Modal";

type Facets = {
  cities: { name: string; slug: string }[];
  localities: { name: string; slug: string; city: string }[];
};

/** Chip button used by both the desktop bar and the mobile sheet. */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`px-4 py-2.5 text-[12px] tracking-[0.2em] uppercase transition-all ${
        active
          ? "border border-transparent text-ink"
          : "border border-gold/30 text-ivory/60 hover:border-gold-hi/70"
      }`}
      style={
        active
          ? { background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }
          : undefined
      }
    >
      {children}
    </button>
  );
}

export function Filters({
  facets,
  total,
  activeCount,
}: {
  facets: Facets;
  total: number;
  activeCount: number;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const [pending, startTransition] = useTransition();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [q, setQ] = useState(params.get("q") ?? "");

  // Keep the input in step when the user navigates back/forward. The URL is
  // the external store here; the input mirrors it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQ(params.get("q") ?? "");
  }, [params]);

  /** Writes a change into the URL — the URL is the single source of truth,
   *  so every filter combination is shareable and back/forward just work. */
  const update = useCallback(
    (mutate: (p: URLSearchParams) => void) => {
      const next = new URLSearchParams(params.toString());
      mutate(next);
      next.delete("page"); // any filter change returns to page 1
      const qs = next.toString();
      startTransition(() => {
        router.push(qs ? `/properties?${qs}` : "/properties", { scroll: false });
      });
    },
    [params, router]
  );

  const get = (key: string) => params.get(key) ?? "";
  const getList = (key: string) => (params.get(key) ?? "").split(",").filter(Boolean);

  const toggleInList = (key: string, value: string) =>
    update((p) => {
      const list = (p.get(key) ?? "").split(",").filter(Boolean);
      const next = list.includes(value)
        ? list.filter((v) => v !== value)
        : [...list, value];
      if (next.length) p.set(key, next.join(","));
      else p.delete(key);
    });

  const setSingle = (key: string, value: string) =>
    update((p) => {
      if (value) p.set(key, value);
      else p.delete(key);
    });

  const activeBand = PRICE_BANDS.find(
    (b) =>
      String(b.min ?? "") === get("min") && String(b.max ?? "") === get("max")
  );

  const localities = get("city")
    ? facets.localities.filter(
        (l) => l.city.toLowerCase().replace(/\s+/g, "-") === get("city")
      )
    : facets.localities;

  /* ---- the control groups, shared between desktop and the mobile sheet ---- */
  const controls = (
    <>
      <FilterGroup label="Type">
        <div className="flex flex-wrap gap-2">
          <Chip active={!get("type")} onClick={() => setSingle("type", "")}>
            All
          </Chip>
          {PROPERTY_TYPES.map((t) => (
            <Chip
              key={t}
              active={get("type") === t}
              onClick={() => setSingle("type", get("type") === t ? "" : t)}
            >
              {t}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Budget">
        <div className="flex flex-wrap gap-2">
          {PRICE_BANDS.map((b) => (
            <Chip
              key={b.label}
              active={
                b.label === "All"
                  ? !get("min") && !get("max")
                  : activeBand?.label === b.label
              }
              onClick={() =>
                update((p) => {
                  if (b.min === null) p.delete("min");
                  else p.set("min", String(b.min));
                  if (b.max === null) p.delete("max");
                  else p.set("max", String(b.max));
                })
              }
            >
              {b.label}
            </Chip>
          ))}
        </div>
        <div className="mt-3 flex items-center gap-3">
          <NumberInput
            label="Min ₹ Cr"
            value={get("min")}
            onCommit={(v) => setSingle("min", v)}
          />
          <span className="text-ivory/30">—</span>
          <NumberInput
            label="Max ₹ Cr"
            value={get("max")}
            onCommit={(v) => setSingle("max", v)}
          />
        </div>
      </FilterGroup>

      <FilterGroup label="Bedrooms">
        <div className="flex flex-wrap gap-2">
          {BEDROOM_OPTIONS.map((b) => (
            <Chip
              key={b}
              active={getList("beds").includes(String(b))}
              onClick={() => toggleInList("beds", String(b))}
            >
              {b === 5 ? "5+" : b} BHK
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Location">
        <div className="flex flex-wrap gap-3">
          <select
            value={get("city")}
            onChange={(e) =>
              update((p) => {
                if (e.target.value) p.set("city", e.target.value);
                else p.delete("city");
                p.delete("locality"); // locality belongs to the old city
              })
            }
            aria-label="City"
            className="border border-gold/30 bg-ink px-3 py-2.5 text-[13px] text-ivory/80 outline-none focus:border-gold-hi"
          >
            <option value="">All cities</option>
            {facets.cities.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={get("locality")}
            onChange={(e) => setSingle("locality", e.target.value)}
            aria-label="Locality"
            className="border border-gold/30 bg-ink px-3 py-2.5 text-[13px] text-ivory/80 outline-none focus:border-gold-hi"
          >
            <option value="">All localities</option>
            {localities.map((l) => (
              <option key={l.slug} value={l.slug}>
                {l.name}
              </option>
            ))}
          </select>
        </div>
      </FilterGroup>

      <FilterGroup label="Possession">
        <div className="flex flex-wrap gap-2">
          {POSSESSION_STATUSES.map((s) => (
            <Chip
              key={s}
              active={get("possession") === s}
              onClick={() => setSingle("possession", get("possession") === s ? "" : s)}
            >
              {s}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Amenities">
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <Chip
              key={a}
              active={getList("amenities").includes(a)}
              onClick={() => toggleInList("amenities", a)}
            >
              {a}
            </Chip>
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Assurance">
        <label className="flex cursor-pointer items-center gap-3 text-[13px] text-ivory/70">
          <input
            type="checkbox"
            checked={get("escrow") === "1"}
            onChange={(e) => setSingle("escrow", e.target.checked ? "1" : "")}
            className="h-4 w-4 accent-[var(--gold)]"
          />
          Payments tied to construction progress
        </label>
      </FilterGroup>
    </>
  );

  return (
    <div className="mb-10">
      {/* Search + sort, always visible */}
      <div className="flex flex-wrap items-center gap-3">
        <form
          className="relative min-w-0 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            setSingle("q", q.trim());
          }}
          role="search"
        >
          <label htmlFor="property-search" className="sr-only">
            Search properties
          </label>
          <input
            id="property-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, locality, city or builder…"
            className="w-full border border-gold/25 bg-ink px-4 py-3 text-[15px] text-ivory outline-none transition-colors focus:border-gold-hi"
          />
          <button
            type="submit"
            className="absolute top-1/2 right-2 -translate-y-1/2 px-3 py-1.5 text-[11px] tracking-[0.2em] text-gold-hi uppercase"
          >
            Search
          </button>
        </form>

        <select
          value={get("sort") || "newest"}
          onChange={(e) => setSingle("sort", e.target.value === "newest" ? "" : e.target.value)}
          aria-label="Sort results"
          className="border border-gold/25 bg-ink px-3 py-3 text-[13px] text-ivory/80 outline-none focus:border-gold-hi"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="border border-gold/30 px-5 py-3 text-[12px] tracking-[0.2em] text-gold-hi uppercase lg:hidden"
        >
          Filters{activeCount ? ` (${activeCount})` : ""}
        </button>
      </div>

      {/* Desktop filter panel */}
      <div className="mt-6 hidden flex-col gap-5 lg:flex">{controls}</div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-gold/15 pt-5">
        <span
          className="text-[13px] tracking-[0.1em] text-ivory/45"
          aria-live="polite"
          role="status"
        >
          {pending
            ? "Searching…"
            : `${total} ${total === 1 ? "property" : "properties"} · all Glass-File verified`}
        </span>
        {activeCount > 0 && (
          <button
            type="button"
            onClick={() => startTransition(() => router.push("/properties", { scroll: false }))}
            className="text-[12px] tracking-[0.2em] text-gold-hi uppercase underline underline-offset-4"
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Mobile bottom sheet */}
      <Modal
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Filters"
        variant="sheet"
      >
        <div className="flex flex-col gap-5 px-6 pt-4 pb-6">{controls}</div>
        <div className="sticky bottom-0 flex gap-3 border-t border-gold/20 bg-ink-2 px-6 py-4">
          <button
            type="button"
            onClick={() => {
              startTransition(() => router.push("/properties", { scroll: false }));
              setSheetOpen(false);
            }}
            className="flex-1 border border-gold/30 py-3.5 text-[12px] tracking-[0.2em] text-ivory/70 uppercase"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex-1 py-3.5 text-[12px] tracking-[0.2em] text-ink uppercase"
            style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
          >
            Show {total} {total === 1 ? "result" : "results"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <fieldset className="border-0 p-0">
      <legend className="mb-2.5 text-[11px] tracking-[0.28em] text-gold uppercase">
        {label}
      </legend>
      {children}
    </fieldset>
  );
}

/** Commits on blur/Enter rather than per keystroke, so typing "12" doesn't
 *  fire a navigation for "1" first. */
function NumberInput({
  label,
  value,
  onCommit,
}: {
  label: string;
  value: string;
  onCommit: (v: string) => void;
}) {
  const [local, setLocal] = useState(value);
  // Resync when the URL changes underneath us (back button, clear filters).
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setLocal(value), [value]);

  return (
    <input
      type="number"
      inputMode="decimal"
      min={0}
      step="0.1"
      aria-label={label}
      placeholder={label}
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={() => local !== value && onCommit(local)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onCommit(local);
        }
      }}
      className="w-28 border border-gold/30 bg-ink px-3 py-2 text-[13px] text-ivory outline-none focus:border-gold-hi"
    />
  );
}
