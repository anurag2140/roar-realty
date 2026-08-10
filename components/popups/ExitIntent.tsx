"use client";

import { useEffect, useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { LeadForm } from "@/components/forms/LeadForm";
import type { SiteSettings } from "@/lib/sanity/types";

const KEY = "roar_exit_intent_seen";
const SUPPRESS_DAYS = 30;
const MOBILE_DELAY_MS = 35_000;
const MOBILE_SCROLL_THRESHOLD = 0.5;

function suppressed(): boolean {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return false;
    return Date.now() - Number(raw) < SUPPRESS_DAYS * 864e5;
  } catch {
    return false;
  }
}

function suppress() {
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* private browsing — showing it again is an acceptable failure */
  }
}

/**
 * Desktop: fires when the pointer leaves through the top of the viewport.
 * Mobile: has no exit intent to detect, so it waits for 35s AND 50% scroll —
 * both, so we never interrupt someone who just arrived.
 */
export function ExitIntent({ settings }: { settings: SiteSettings | null }) {
  const config = settings?.exitIntent;
  const enabled = config?.enabled !== false;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!enabled || suppressed()) return;

    let fired = false;
    const fire = () => {
      if (fired) return;
      fired = true;
      setOpen(true);
      cleanup();
    };

    const onMouseOut = (e: MouseEvent) => {
      // relatedTarget null + leaving through the top edge = heading for the
      // tab bar or address bar.
      if (!e.relatedTarget && e.clientY <= 0) fire();
    };

    let timeReached = false;
    let scrollReached = false;
    const maybeFireMobile = () => {
      if (timeReached && scrollReached) fire();
    };
    const onScroll = () => {
      const el = document.documentElement;
      const progress = window.scrollY / Math.max(el.scrollHeight - el.clientHeight, 1);
      if (progress >= MOBILE_SCROLL_THRESHOLD) {
        scrollReached = true;
        maybeFireMobile();
      }
    };

    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    let timer: number | undefined;

    if (isTouch) {
      timer = window.setTimeout(() => {
        timeReached = true;
        maybeFireMobile();
      }, MOBILE_DELAY_MS);
      window.addEventListener("scroll", onScroll, { passive: true });
    } else {
      document.addEventListener("mouseout", onMouseOut);
    }

    function cleanup() {
      document.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("scroll", onScroll);
      if (timer) window.clearTimeout(timer);
    }

    return cleanup;
  }, [enabled]);

  if (!enabled) return null;

  return (
    <Modal
      open={open}
      onClose={() => {
        suppress();
        setOpen(false);
      }}
      title={config?.heading || "Before you go,"}
      description={
        config?.body ||
        "Get our Delhi NCR market brief: what's actually selling, where prices moved, and which projects we walked away from. One email, no follow-up calls."
      }
      size="sm"
    >
      <div className="px-8 pt-4 pb-9">
        <LeadForm
          formType="exit-intent"
          compact
          showMessage={false}
          submitLabel={config?.cta || "Send me the brief →"}
          successHeading="On its way."
          successBody={"Check your inbox in the next few minutes."}
          onSuccess={suppress}
        />
      </div>
    </Modal>
  );
}
