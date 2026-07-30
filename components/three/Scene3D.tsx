"use client";

import { useEffect, useRef, useState } from "react";
import { detectCapability } from "./capability";
import type { SceneHandle } from "./scenes";

export type SceneKind = "hero" | "gold" | "journey";

type Props = {
  kind: SceneKind;
  /** Master switch from Site Settings. */
  enabled?: boolean;
  intensity?: number;
  className?: string;
  /** Shown while loading, on weak devices, and if WebGL fails outright. */
  fallback?: React.ReactNode;
};

/**
 * Lazy, capability-gated wrapper around the WebGL scenes.
 *
 * Three.js (~600 KB) is imported only when a scene is about to enter the
 * viewport on a device that can handle it — so phones and reduced-motion users
 * never download it at all.
 */
export function Scene3D({
  kind,
  enabled = true,
  intensity = 1,
  className = "",
  fallback,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    // ?force3d=1 skips both gates. IntersectionObserver never fires in a
    // hidden/non-compositing document, which makes the scenes impossible to
    // verify in headless QA; this is the escape hatch for that.
    const forced =
      typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("force3d") === "1";

    if (!forced && detectCapability() !== "full") return;

    const el = containerRef.current;
    if (!el) return;

    if (forced) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActive(true);
      return;
    }

    // Wait until the scene is near the viewport before paying for Three.js.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  useEffect(() => {
    if (!active) return;
    const el = containerRef.current;
    if (!el) return;

    let handle: SceneHandle | null = null;
    let cancelled = false;

    (async () => {
      try {
        const [THREE, scenes] = await Promise.all([
          import("three"),
          import("./scenes"),
        ]);
        if (cancelled || !el.isConnected) return;

        const ctx = { THREE, container: el };
        handle =
          kind === "hero"
            ? scenes.createHeroScene(ctx)
            : kind === "gold"
              ? scenes.createGoldShader(ctx, intensity)
              : scenes.createJourneyScene(ctx);
      } catch (err) {
        // A failed WebGL init must never take the page down — the static
        // fallback underneath is already rendered and looks intentional.
        console.warn(`[Scene3D:${kind}] falling back to static`, err);
      }
    })();

    return () => {
      cancelled = true;
      handle?.dispose();
    };
  }, [active, kind, intensity]);

  // No positioning class here on purpose: callers pass their own (usually
  // `absolute inset-0`), and hardcoding `relative` produced a conflicting
  // "relative absolute" pair whose winner depended on CSS emission order.
  return (
    <div className={className} aria-hidden>
      {fallback}
      <div ref={containerRef} className="absolute inset-0" />
    </div>
  );
}

/** Static stand-ins, designed to read as deliberate rather than as a failure. */

export function HeroFallback() {
  return (
    <div
      className="absolute inset-0"
      style={{
        background:
          "radial-gradient(ellipse 120% 80% at 50% 100%, rgba(198,161,91,.28) 0%, rgba(138,108,51,.12) 35%, rgba(10,9,7,0) 70%)," +
          "linear-gradient(180deg, #0A0907 0%, #12100B 55%, #0A0907 100%)",
      }}
    >
      {/* Suggestion of a skyline, in pure CSS. */}
      <div
        className="absolute right-0 bottom-0 left-0 h-[38%] opacity-30"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, transparent 0 22px, rgba(198,161,91,.5) 22px 23px)," +
            "linear-gradient(180deg, transparent 0%, rgba(198,161,91,.18) 100%)",
          maskImage:
            "linear-gradient(180deg, transparent 0%, #000 40%, #000 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, transparent 0%, #000 40%, #000 100%)",
        }}
      />
    </div>
  );
}

export function GoldFallback({ intensity = 1 }: { intensity?: number }) {
  return (
    <div
      className="absolute inset-0"
      style={{
        opacity: 0.55 * intensity,
        background:
          "radial-gradient(ellipse 80% 60% at 30% 30%, rgba(198,161,91,.45), transparent 60%)," +
          "radial-gradient(ellipse 70% 50% at 75% 65%, rgba(232,205,143,.3), transparent 60%)," +
          "linear-gradient(140deg, #0A0907, #171307 50%, #0A0907)",
      }}
    />
  );
}

export function JourneyFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <svg viewBox="0 0 320 320" className="h-full max-h-[420px] w-full opacity-70" aria-hidden>
        <defs>
          <linearGradient id="roarArc" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a6c33" />
            <stop offset="50%" stopColor="#E8CD8F" />
            <stop offset="100%" stopColor="#8a6c33" />
          </linearGradient>
        </defs>
        <circle cx="160" cy="160" r="96" fill="none" stroke="#8a6c33" strokeWidth="0.6" opacity="0.5" />
        <ellipse cx="160" cy="160" rx="96" ry="34" fill="none" stroke="#8a6c33" strokeWidth="0.5" opacity="0.35" />
        <ellipse cx="160" cy="160" rx="96" ry="66" fill="none" stroke="#8a6c33" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="160" cy="160" rx="38" ry="96" fill="none" stroke="#8a6c33" strokeWidth="0.5" opacity="0.3" />
        <ellipse cx="160" cy="160" rx="70" ry="96" fill="none" stroke="#8a6c33" strokeWidth="0.5" opacity="0.25" />
        <path d="M96 132 Q160 68 224 148" fill="none" stroke="url(#roarArc)" strokeWidth="1.6" />
        <circle cx="96" cy="132" r="4" fill="#f0d9a0" />
        <circle cx="224" cy="148" r="4" fill="#f0d9a0" />
      </svg>
    </div>
  );
}
