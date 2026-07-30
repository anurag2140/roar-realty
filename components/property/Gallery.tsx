"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { imageSrcSet, imageUrl } from "@/lib/sanity/image";
import type { SanityImage } from "@/lib/sanity/image";
import { Modal } from "@/components/ui/Modal";

export function Gallery({
  images,
  name,
}: {
  images: SanityImage[];
  name: string;
}) {
  const [lightboxAt, setLightboxAt] = useState<number | null>(null);
  const open = lightboxAt !== null;

  const go = useCallback(
    (delta: number) => {
      setLightboxAt((cur) =>
        cur === null ? null : (cur + delta + images.length) % images.length
      );
    },
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, go]);

  // Swipe support — a gallery you can't swipe on a phone feels broken.
  const touchX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
    touchX.current = null;
  };

  if (!images.length) {
    return (
      <div className="flex h-[280px] w-full items-center justify-center border border-gold/20 bg-ink-2 text-xs tracking-[0.2em] text-gold/40 uppercase sm:h-[460px]">
        Photographs coming soon
      </div>
    );
  }

  const [hero, ...rest] = images;

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-[2fr_1fr] sm:grid-rows-2">
        <button
          type="button"
          onClick={() => setLightboxAt(0)}
          aria-label={`Open photo 1 of ${images.length} full screen`}
          className="group relative overflow-hidden sm:row-span-2"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl(hero, 1200, 900) ?? ""}
            srcSet={imageSrcSet(hero, [640, 1080, 1440, 1920], 4 / 3) ?? undefined}
            sizes="(max-width: 640px) 100vw, 66vw"
            alt={hero.alt || `${name} — main photograph`}
            width={1200}
            height={900}
            fetchPriority="high"
            decoding="async"
            className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[460px]"
          />
          <span className="absolute right-3 bottom-3 bg-ink/80 px-3 py-1.5 text-[11px] tracking-[0.18em] text-gold-hi uppercase backdrop-blur-sm">
            {images.length} photos
          </span>
        </button>

        {rest.slice(0, 2).map((img, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setLightboxAt(i + 1)}
            aria-label={`Open photo ${i + 2} of ${images.length} full screen`}
            className="group relative hidden overflow-hidden sm:block"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl(img, 700, 520) ?? ""}
              alt={img.alt || `${name} — photograph ${i + 2}`}
              width={700}
              height={520}
              loading="lazy"
              decoding="async"
              className="h-[226px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {i === 1 && images.length > 3 && (
              <span className="absolute inset-0 flex items-center justify-center bg-ink/65 font-display text-2xl text-ivory">
                +{images.length - 3} more
              </span>
            )}
          </button>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setLightboxAt(null)}
        variant="full"
        title={`${name} — photographs`}
        hideTitle
        className="bg-ink/98"
      >
        {open && (
          <div
            className="flex h-full flex-col"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="text-[12px] tracking-[0.2em] text-ivory/60 uppercase">
                {lightboxAt + 1} / {images.length}
              </span>
              <button
                type="button"
                onClick={() => setLightboxAt(null)}
                aria-label="Close gallery"
                className="flex h-11 w-11 items-center justify-center text-3xl leading-none text-ivory/60 hover:text-gold-hi"
              >
                ×
              </button>
            </div>

            <div className="relative flex min-h-0 flex-1 items-center justify-center px-4">
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 z-10 flex h-12 w-12 items-center justify-center border border-gold/30 bg-ink/70 text-2xl text-ivory/80 backdrop-blur-sm hover:border-gold-hi hover:text-gold-hi"
                >
                  ‹
                </button>
              )}

              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl(images[lightboxAt], 1920) ?? ""}
                alt={
                  images[lightboxAt].alt ||
                  `${name} — photograph ${lightboxAt + 1} of ${images.length}`
                }
                className="max-h-full max-w-full object-contain"
              />

              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next photo"
                  className="absolute right-2 z-10 flex h-12 w-12 items-center justify-center border border-gold/30 bg-ink/70 text-2xl text-ivory/80 backdrop-blur-sm hover:border-gold-hi hover:text-gold-hi"
                >
                  ›
                </button>
              )}
            </div>

            {images[lightboxAt].caption && (
              <p className="px-6 py-3 text-center text-sm text-ivory/55">
                {images[lightboxAt].caption}
              </p>
            )}

            <div className="roar-scrollbar flex gap-2 overflow-x-auto px-4 py-4">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setLightboxAt(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  aria-current={i === lightboxAt}
                  className={`shrink-0 border-2 transition-colors ${
                    i === lightboxAt ? "border-gold-hi" : "border-transparent opacity-50"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl(img, 120, 80) ?? ""}
                    alt=""
                    width={120}
                    height={80}
                    loading="lazy"
                    className="h-14 w-20 object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
