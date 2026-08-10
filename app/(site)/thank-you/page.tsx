import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Thank you",
  description: "Your enquiry is with our Gurugram desk.",
  // A conversion landing page has no business in search results.
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-5 py-24 text-center lg:px-10">
      <div className="mb-5 font-serif text-[clamp(2rem,5vw,3rem)] italic text-gold-hi">
        Consider it heard.
      </div>
      <p className="max-w-md text-[17px] leading-[1.8] text-ivory/60">
        Your brief is with our Gurugram desk. Expect a curated shortlist, each
        listing with its complete Glass File, within 48 hours.
      </p>
      <p className="mt-4 text-sm text-ivory/40">
        No obligation, and no follow-up calls you didn&apos;t ask for.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink href="/properties" size="lg">
          Keep browsing →
        </ButtonLink>
        <ButtonLink href="/" variant="outline" size="lg">
          Back to home
        </ButtonLink>
      </div>
    </div>
  );
}
