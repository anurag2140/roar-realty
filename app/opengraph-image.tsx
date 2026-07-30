import { ImageResponse } from "next/og";
import { SITE_NAME, SITE_TAGLINE } from "@/lib/site";

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default social card. Generated at build time, so it costs nothing at runtime. */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(ellipse 100% 70% at 50% 100%, #1a1509 0%, #0A0907 70%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#C6A15B",
          }}
        >
          <div style={{ width: 60, height: 2, background: "#C6A15B" }} />
          Dubai → Delhi NCR
        </div>

        <div
          style={{
            marginTop: 34,
            fontSize: 86,
            lineHeight: 1.05,
            color: "#F4EFE4",
            fontFamily: "serif",
          }}
        >
          India, meet
        </div>
        <div
          style={{
            fontSize: 86,
            lineHeight: 1.05,
            color: "#E8CD8F",
            fontFamily: "serif",
          }}
        >
          the Dubai standard.
        </div>

        <div
          style={{
            marginTop: 44,
            display: "flex",
            gap: 40,
            fontSize: 21,
            color: "rgba(244,239,228,0.55)",
          }}
        >
          <span>Escrow-protected</span>
          {/* A plain middot, not the site's ✦ — next/og's dynamic font
              loader cannot resolve that glyph and warns on every build. */}
          <span style={{ color: "#C6A15B" }}>·</span>
          <span>Title verified thrice</span>
          {/* A plain middot, not the site's ✦ — next/og's dynamic font
              loader cannot resolve that glyph and warns on every build. */}
          <span style={{ color: "#C6A15B" }}>·</span>
          <span>Carpet-area pricing</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 60,
            right: 80,
            fontSize: 26,
            letterSpacing: 9,
            color: "#F4EFE4",
            fontFamily: "serif",
          }}
        >
          ROAR REALTY
        </div>
      </div>
    ),
    size
  );
}
