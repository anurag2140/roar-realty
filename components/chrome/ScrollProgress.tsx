"use client";

import { useEffect, useRef } from "react";

/** The 2px gold bar across the top, rAF-throttled exactly as in the prototype. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const el = document.documentElement;
        const max = el.scrollHeight - el.clientHeight;
        if (ref.current && max > 0) {
          ref.current.style.width = `${(window.scrollY / max) * 100}%`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed top-0 left-0 z-1000 h-0.5 w-0"
      style={{
        background: "linear-gradient(90deg, var(--gold), var(--goldhi))",
      }}
    />
  );
}
