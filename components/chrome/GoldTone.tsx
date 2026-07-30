/**
 * Lets Site Settings shift the brand gold without a redeploy.
 *
 * Rendered server-side as a <style> tag so the correct tone is present in the
 * very first byte of HTML — doing this in an effect would cause a visible
 * colour flash on every page load.
 */
export function GoldTone({ tone }: { tone?: string }) {
  const gold = /^#[0-9a-f]{6}$/i.test(tone || "") ? tone! : "#C6A15B";
  const hi = lighten(gold, 0.35);

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `:root{--gold:${gold};--goldhi:${hi};}`,
      }}
    />
  );
}

/** Mirrors the prototype's `lighten()` so the highlight tone matches exactly. */
function lighten(hex: string, k: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  const f = (c: number) => Math.round(c + (255 - c) * k);
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
