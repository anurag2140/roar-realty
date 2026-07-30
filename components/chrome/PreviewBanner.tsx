import { isLive } from "@/lib/env";

/**
 * Standing reminder that the site is not yet public. Deliberately impossible
 * to miss, and impossible to forget about — it disappears only when
 * NEXT_PUBLIC_LAUNCH_MODE is set to `live`.
 */
export function PreviewBanner() {
  if (isLive) return null;

  return (
    <div
      role="status"
      className="roar-no-print relative z-1100 border-b border-gold/30 bg-gold/10 px-4 py-2 text-center text-[11px] tracking-[0.18em] text-gold-hi uppercase"
    >
      Preview mode · sample content · hidden from search engines
    </div>
  );
}
