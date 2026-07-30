"use client";

import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Nested modals (lightbox opened from inside an enquiry) each need their own
 *  scroll lock; a plain boolean would unlock too early when one closes. */
let lockCount = 0;

function lockScroll() {
  if (lockCount === 0) {
    const width = window.innerWidth - document.documentElement.clientWidth;
    document.body.dataset.scrollLocked = "true";
    // Compensate for the vanishing scrollbar so the page doesn't jump sideways.
    if (width > 0) document.body.style.paddingRight = `${width}px`;
  }
  lockCount += 1;
}

function unlockScroll() {
  lockCount = Math.max(0, lockCount - 1);
  if (lockCount === 0) {
    delete document.body.dataset.scrollLocked;
    document.body.style.paddingRight = "";
  }
}

export type ModalProps = {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Accessible name. Rendered visually unless `hideTitle`. */
  title?: string;
  hideTitle?: boolean;
  description?: string;
  /** `sheet` slides up from the bottom on mobile — used for filters. */
  variant?: "dialog" | "sheet" | "full";
  size?: "sm" | "md" | "lg";
  /** Set false for destructive flows where a stray click shouldn't close. */
  closeOnBackdrop?: boolean;
  className?: string;
};

export function Modal({
  open,
  onClose,
  children,
  title,
  hideTitle,
  description,
  variant = "dialog",
  size = "md",
  closeOnBackdrop = true,
  className = "",
}: ModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descId = useId();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panelRef.current) return;

      const items = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
      ).filter((el) => el.offsetParent !== null || el === document.activeElement);
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      // Wrap focus at both ends so Tab can never escape into the page behind.
      if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    lockScroll();
    document.addEventListener("keydown", handleKeyDown, true);

    // Focus the first meaningful control, falling back to the panel itself.
    const t = window.setTimeout(() => {
      const target =
        panelRef.current?.querySelector<HTMLElement>("[data-autofocus]") ??
        panelRef.current?.querySelector<HTMLElement>(FOCUSABLE) ??
        panelRef.current;
      target?.focus();
    }, 20);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", handleKeyDown, true);
      unlockScroll();
      // Return focus to whatever opened the modal — otherwise keyboard users
      // are dumped back at the top of the document.
      previouslyFocused.current?.focus?.();
    };
  }, [open, handleKeyDown]);

  if (!open || typeof document === "undefined") return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-xl",
    lg: "max-w-4xl",
  } as const;

  const isSheet = variant === "sheet";
  const isFull = variant === "full";

  return createPortal(
    <div
      className="roar-no-print fixed inset-0 z-1300 flex"
      style={{ animation: "roarBackdropIn .2s ease-out" }}
    >
      <div
        className="absolute inset-0 bg-ink/85 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={title ? undefined : "Dialog"}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        className={[
          "relative z-10 outline-none",
          isFull
            ? "m-0 h-full w-full"
            : isSheet
              ? "mt-auto max-h-[88vh] w-full overflow-y-auto rounded-t-lg border-t border-gold/25 bg-ink-2 sm:m-auto sm:max-h-[85vh] sm:max-w-lg sm:rounded-lg sm:border"
              : `m-auto max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto border border-gold/25 bg-ink-2 ${sizes[size]}`,
          "roar-scrollbar",
          className,
        ].join(" ")}
        style={{
          animation: isSheet
            ? "roarSheetUp .28s cubic-bezier(.22,.8,.3,1)"
            : "roarModalIn .24s cubic-bezier(.22,.8,.3,1)",
        }}
      >
        {!isFull && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center text-2xl leading-none text-ivory/50 transition-colors hover:text-gold-hi"
          >
            ×
          </button>
        )}

        {title && (
          <h2
            id={titleId}
            className={
              hideTitle
                ? "sr-only"
                : "px-8 pt-8 pb-1 font-display text-2xl text-ivory sm:text-[28px]"
            }
          >
            {title}
          </h2>
        )}
        {description && (
          <p
            id={descId}
            className={hideTitle ? "sr-only" : "px-8 pb-2 text-sm leading-relaxed text-ivory/55"}
          >
            {description}
          </p>
        )}

        {children}
      </div>
    </div>,
    document.body
  );
}
