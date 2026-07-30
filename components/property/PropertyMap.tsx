"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

/**
 * OpenStreetMap via Leaflet.
 *
 * Deliberately not Google Maps: the Maps JavaScript API requires a billing
 * account with a card on file even inside the free credit, which conflicts
 * with the zero-cost constraint. OSM needs no key and no account.
 *
 * Leaflet itself is code-split and only fetched once the map scrolls into
 * view, so listing pages don't carry it in their initial bundle.
 */
export function PropertyMap({
  lat,
  lng,
  name,
  address,
}: {
  lat: number;
  lng: number;
  name: string;
  address?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    const io = new IntersectionObserver(
      async (entries) => {
        if (!entries[0]?.isIntersecting) return;
        io.disconnect();

        try {
          const L = (await import("leaflet")).default;
          if (cancelled || !el.isConnected) return;

          const map = L.map(el, {
            center: [lat, lng],
            zoom: 14,
            scrollWheelZoom: false,
            attributionControl: true,
          });

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 18,
          }).addTo(map);

          // Default Leaflet marker icons resolve to relative image paths that
          // break under a bundler, so draw the pin ourselves.
          L.circleMarker([lat, lng], {
            radius: 10,
            color: "#E8CD8F",
            fillColor: "#C6A15B",
            fillOpacity: 0.9,
            weight: 2,
          })
            .addTo(map)
            .bindPopup(`<strong>${name}</strong>${address ? `<br>${address}` : ""}`);

          cleanup = () => map.remove();
        } catch {
          setFailed(true);
        }
      },
      { rootMargin: "200px" }
    );

    io.observe(el);
    return () => {
      cancelled = true;
      io.disconnect();
      cleanup?.();
    };
  }, [lat, lng, name, address]);

  const osmLink = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=15/${lat}/${lng}`;

  if (failed) {
    return (
      <a
        href={osmLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[320px] items-center justify-center border border-gold/20 bg-ink-2 text-sm text-gold-hi underline underline-offset-4"
      >
        Open this location in a map →
      </a>
    );
  }

  return (
    <div className="relative">
      <div
        ref={ref}
        className="h-[320px] w-full border border-gold/20 bg-ink-2"
        role="img"
        aria-label={`Map showing the location of ${name}`}
      />
      <a
        href={osmLink}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-[11px] tracking-[0.18em] text-gold-hi uppercase"
      >
        Open larger map →
      </a>
    </div>
  );
}
