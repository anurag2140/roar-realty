"use client";

import { useEffect } from "react";

/**
 * Drives `.roar-reveal` elements into view.
 *
 * Uses a single MutationObserver + IntersectionObserver pair for the whole
 * document rather than per-component hooks — the prototype attached observers
 * on mount only, so anything rendered later (filtered property cards, modal
 * content) never revealed and stayed invisible at opacity:0.
 */
export function RevealProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      document
        .querySelectorAll<HTMLElement>(".roar-reveal")
        .forEach((el) => el.setAttribute("data-revealed", "true"));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            (e.target as HTMLElement).setAttribute("data-revealed", "true");
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const observe = (root: ParentNode) => {
      root.querySelectorAll?.<HTMLElement>(".roar-reveal").forEach((el) => {
        if (el.dataset.revealed === "true" || el.dataset.revealObserved === "true") return;
        // Anything already above the fold reveals immediately — otherwise
        // content at the top of the page would sit invisible until scroll.
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.9) {
          el.setAttribute("data-revealed", "true");
          return;
        }
        el.dataset.revealObserved = "true";
        io.observe(el);
      });
    };

    observe(document);

    const mo = new MutationObserver((records) => {
      for (const rec of records) {
        rec.addedNodes.forEach((n) => {
          if (n.nodeType === 1) observe(n as Element);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return <>{children}</>;
}
