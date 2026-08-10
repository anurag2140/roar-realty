import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/PageHeader";
import { ShortlistView } from "@/components/shortlist/ShortlistView";

export const metadata: Metadata = {
  title: "My shortlist",
  description: "The properties you've saved, side by side.",
  robots: { index: false, follow: true },
  alternates: { canonical: "/shortlist" },
};

export default function ShortlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="Saved by you"
        title="Your shortlist."
        intro="Saved on this device, no account needed. Send the whole list to us and we'll come back with a Glass File for each."
      />
      <ShortlistView />
    </>
  );
}
