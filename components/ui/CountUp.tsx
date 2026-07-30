"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to `to` when scrolled into view, once.
 *
 * The final value is rendered server-side and only replaced once the animation
 * starts, so the real number is in the HTML for crawlers and for anyone with
 * JS disabled — the prototype rendered the target and then animated over it,
 * which is fine, but it also re-ran on every filter change.
 */
export function CountUp({
  to,
  display,
  suffix = "",
  duration = 1600,
}: {
  to: number;
  display: string;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver((entries) => {
      if (!entries[0]?.isIntersecting) return;
      io.disconnect();

      const start = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const k = Math.min((now - start) / duration, 1);
        // Cubic ease-out, same curve as the prototype.
        const v = Math.round(to * (1 - Math.pow(1 - k, 3)));
        setValue(v.toLocaleString("en-IN"));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    });

    io.observe(el);
    return () => io.disconnect();
  }, [to, duration]);

  // `display` is the complete final string ("12 yrs", "4,200+"), so the suffix
  // is only appended while the animated number is standing in for it.
  return <span ref={ref}>{value === null ? display : `${value}${suffix}`}</span>;
}
