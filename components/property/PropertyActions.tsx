"use client";

import { useState } from "react";
import { useEnquiry } from "@/components/popups/EnquiryProvider";
import { useShortlist } from "@/components/shortlist/ShortlistProvider";
import { useToast } from "@/components/ui/Toast";
import { Modal } from "@/components/ui/Modal";
import { LeadForm } from "@/components/forms/LeadForm";
import { Button } from "@/components/ui/Button";
import { MAX_COMPARE, formatPriceCr, telLink, whatsappLink } from "@/lib/site";
import type { Property } from "@/lib/sanity/types";

/** Converts a YouTube/Vimeo watch URL into its embeddable form. */
function toEmbed(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      return v ? `https://www.youtube-nocookie.com/embed/${v}` : null;
    }
    if (u.hostname === "youtu.be") {
      return `https://www.youtube-nocookie.com/embed/${u.pathname.slice(1)}`;
    }
    if (u.hostname.includes("vimeo.com")) {
      return `https://player.vimeo.com/video/${u.pathname.split("/").filter(Boolean).pop()}`;
    }
    return null;
  } catch {
    return null;
  }
}

export function PropertyActions({
  property,
  phone,
  whatsapp,
}: {
  property: Property;
  phone?: string;
  whatsapp?: string;
}) {
  const { requestGlassFile, scheduleVisit } = useEnquiry();
  const { has, toggle, inCompare, toggleCompare, compareIds, ready } = useShortlist();
  const { toast } = useToast();
  const [brochureOpen, setBrochureOpen] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);

  const target = { id: property._id, name: property.name, slug: property.slug };
  const saved = ready && has(property._id);
  const comparing = ready && inCompare(property._id);
  const embed = property.videoUrl ? toEmbed(property.videoUrl) : null;

  const wa = whatsapp
    ? whatsappLink(
        whatsapp,
        `Hello Roar Realty — I'm interested in ${property.name} (${formatPriceCr(property.priceCr)}).`
      )
    : "";
  const tel = telLink(phone || "");

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: property.name, url });
        return;
      } catch {
        // User cancelled the share sheet — fall through to copying.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      toast("Link copied to clipboard.", "success");
    } catch {
      toast("Could not copy the link.", "error");
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <Button size="lg" onClick={() => requestGlassFile(target)} className="w-full">
          Request Glass File →
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => scheduleVisit(target)}
          className="w-full"
        >
          Schedule a site visit
        </Button>

        <div className="grid grid-cols-2 gap-3">
          {tel && (
            <a
              href={tel}
              className="border border-gold/30 py-3 text-center text-[11px] tracking-[0.2em] text-ivory/70 uppercase no-underline transition-colors hover:border-gold-hi hover:text-gold-hi"
            >
              Call
            </a>
          )}
          {wa && (
            <a
              href={wa}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gold/30 py-3 text-center text-[11px] tracking-[0.2em] text-ivory/70 uppercase no-underline transition-colors hover:border-gold-hi hover:text-gold-hi"
            >
              WhatsApp
            </a>
          )}
        </div>

        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 border-t border-gold/15 pt-4 text-[11px] tracking-[0.18em] uppercase">
          <button
            type="button"
            onClick={() => {
              const added = toggle(property._id);
              toast(added ? "Saved to your shortlist." : "Removed from your shortlist.", "success");
            }}
            aria-pressed={saved}
            className={saved ? "text-gold-hi" : "text-ivory/50 hover:text-gold-hi"}
          >
            {saved ? "♥ Saved" : "♡ Save"}
          </button>

          <button
            type="button"
            onClick={() => {
              if (!comparing && compareIds.length >= MAX_COMPARE) {
                toast(`You can compare up to ${MAX_COMPARE} properties.`, "error");
                return;
              }
              const added = toggleCompare(property._id);
              toast(added ? "Added to compare." : "Removed from compare.", "success");
            }}
            aria-pressed={comparing}
            className={comparing ? "text-gold-hi" : "text-ivory/50 hover:text-gold-hi"}
          >
            {comparing ? "✓ Comparing" : "⇄ Compare"}
          </button>

          <button
            type="button"
            onClick={share}
            className="text-ivory/50 hover:text-gold-hi"
          >
            ↗ Share
          </button>

          {property.brochureUrl && (
            <button
              type="button"
              onClick={() => setBrochureOpen(true)}
              className="text-ivory/50 hover:text-gold-hi"
            >
              ↓ Brochure
            </button>
          )}

          {embed && (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="text-ivory/50 hover:text-gold-hi"
            >
              ▶ Video
            </button>
          )}
        </div>
      </div>

      {/* Brochure gate — the download is the incentive to leave a number. */}
      <Modal
        open={brochureOpen}
        onClose={() => setBrochureOpen(false)}
        title="Download the brochure"
        description="Tell us where to send it and we'll open it right away."
        size="sm"
      >
        <div className="px-8 pt-4 pb-9">
          <LeadForm
            formType="brochure"
            property={target}
            compact
            showMessage={false}
            submitLabel="Get the brochure →"
            successHeading="Opening now."
            successBody="Your download should have started in a new tab."
            onSuccess={() => {
              if (property.brochureUrl) {
                window.open(property.brochureUrl, "_blank", "noopener,noreferrer");
              }
            }}
          />
        </div>
      </Modal>

      <Modal
        open={videoOpen}
        onClose={() => setVideoOpen(false)}
        title={`${property.name} — video`}
        hideTitle
        size="lg"
      >
        <div className="aspect-video w-full bg-black">
          {embed && (
            <iframe
              src={embed}
              title={`${property.name} video tour`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full border-0"
            />
          )}
        </div>
      </Modal>
    </>
  );
}
