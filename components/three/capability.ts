/**
 * Decides whether a device should run the Three.js scenes.
 *
 * A lot of the audience will be on mid-range Android over patchy mobile data.
 * Rendering a 700-particle WebGL city on those devices costs frame rate,
 * battery and Lighthouse score, and buys nothing — so we downgrade to a static
 * gold gradient that was designed to look deliberate rather than broken.
 */

export type Capability = "full" | "static";

let cached: Capability | null = null;

function hasWebGL(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl");
    if (!gl) return false;
    // Free the context immediately; browsers cap how many can exist at once.
    const lose = (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context");
    lose?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function detectCapability(): Capability {
  if (cached) return cached;
  if (typeof window === "undefined") return "static";

  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean; effectiveType?: string };
  };

  const lowCores =
    typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 4;
  const lowMemory =
    typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const slowNetwork = ["slow-2g", "2g"].includes(
    nav.connection?.effectiveType ?? ""
  );

  const blocked =
    // Explicit user and platform preferences always win.
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    nav.connection?.saveData === true ||
    !hasWebGL() ||
    // Weak hardware.
    lowCores ||
    lowMemory ||
    // Network speed is only a downgrade signal alongside modest hardware.
    // effectiveType is an estimate and misreports badly in embedded browsers
    // and on first paint — on its own it was downgrading 20-core desktops.
    (slowNetwork && (lowCores || lowMemory));

  cached = blocked ? "static" : "full";
  return cached;
}
