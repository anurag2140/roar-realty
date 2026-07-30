import Link from "next/link";
import { fontVariables } from "@/lib/fonts";

/**
 * Root-level 404. It sits outside the (site) group, so it renders without the
 * site chrome and needs its own minimal shell.
 */
export default function NotFound() {
  return (
    <div
      className={`${fontVariables} flex min-h-screen flex-col items-center justify-center bg-ink px-5 text-center`}
    >
      <div className="font-display text-[clamp(4rem,14vw,9rem)] leading-none text-gold/25">
        404
      </div>
      <h1 className="mt-4 font-display text-[clamp(1.75rem,4vw,2.75rem)] text-ivory">
        This address doesn&apos;t exist.
      </h1>
      <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ivory/55">
        The page may have moved, or the listing may have been sold. Either way,
        we&apos;d rather show you something real.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-4">
        <Link
          href="/properties"
          className="px-8 py-4 text-[13px] tracking-[0.22em] text-ink uppercase no-underline"
          style={{ background: "linear-gradient(120deg, var(--gold, #C6A15B), var(--goldhi, #E8CD8F))" }}
        >
          Browse properties →
        </Link>
        <Link
          href="/"
          className="border border-gold/40 px-8 py-4 text-[13px] tracking-[0.22em] text-gold-hi uppercase no-underline transition-colors hover:bg-gold/10"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
