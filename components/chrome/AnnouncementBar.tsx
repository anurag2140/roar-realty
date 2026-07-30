"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/sanity/types";

const KEY = "roar_announcement_dismissed";

export function AnnouncementBar({ settings }: { settings: SiteSettings | null }) {
  const a = settings?.announcement;
  const [hidden, setHidden] = useState(true);

  // Start hidden and reveal after checking storage, so a dismissed bar never
  // flashes in on hydration.
  useEffect(() => {
    if (!a?.enabled || !a.text) return;
    setHidden(localStorage.getItem(KEY) === a.text);
  }, [a?.enabled, a?.text]);

  if (!a?.enabled || !a.text || hidden) return null;

  const body = (
    <span className="text-[12px] tracking-[0.16em] text-ink uppercase">{a.text}</span>
  );

  return (
    <div
      className="roar-no-print relative z-1100 flex items-center justify-center gap-4 px-10 py-2.5"
      style={{ background: "linear-gradient(120deg, var(--gold), var(--goldhi))" }}
    >
      {a.href ? (
        <Link href={a.href} className="hover:underline">
          {body}
        </Link>
      ) : (
        body
      )}
      <button
        type="button"
        aria-label="Dismiss announcement"
        onClick={() => {
          localStorage.setItem(KEY, a.text!);
          setHidden(true);
        }}
        className="absolute right-3 text-lg leading-none text-ink/60 hover:text-ink"
      >
        ×
      </button>
    </div>
  );
}
