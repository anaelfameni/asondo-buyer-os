import { ImageResponse } from "next/og";

/**
 * Default Open Graph image for the Asondo site.
 *
 * Next.js' file-system metadata convention picks this file up
 * automatically: every page that doesn't override
 * `metadata.openGraph.images` will use this 1200×630 image. Twitter
 * card pulls from the same convention via `twitter-image.tsx`.
 *
 * Runtime is `edge` so the SVG → PNG rendering happens on the CDN
 * close to the consumer (LinkedIn, Twitter, WhatsApp scrapers).
 */
export const runtime = "edge";

export const alt =
  "Asondo — Ivorian Cocoa Export OS · EUDR-Ready · CCC Licensed Exporter 2025/26";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 88px",
          backgroundImage:
            "linear-gradient(135deg, #E8833D 0%, #D06B1F 50%, #A85318 100%)",
          color: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative orbs */}
        <div
          style={{
            position: "absolute",
            top: -160,
            right: -160,
            width: 520,
            height: 520,
            borderRadius: "50%",
            background: "rgba(31, 61, 47, 0.25)",
            filter: "blur(80px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -160,
            left: -160,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "rgba(242, 184, 62, 0.25)",
            filter: "blur(80px)",
          }}
        />

        {/* Top row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "-0.02em",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "#FFFFFF",
                color: "#D06B1F",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 800,
                fontSize: 32,
              }}
            >
              A
            </div>
            asondo
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 18px",
              background: "rgba(255, 255, 255, 0.18)",
              border: "1px solid rgba(255, 255, 255, 0.4)",
              borderRadius: 999,
              fontSize: 18,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#F2B83E",
              }}
            />
            EUDR-Ready
          </div>
        </div>

        {/* Headline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 24,
            zIndex: 1,
            maxWidth: 960,
          }}
        >
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
            }}
          >
            Ivorian cocoa,
            <br />
            traced and sustainable.
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 500,
              lineHeight: 1.4,
              maxWidth: 880,
              color: "rgba(255, 255, 255, 0.92)",
            }}
          >
            Direct link between EU buyers and Ivorian smallholder
            cooperatives. Full traceability. EUDR-aligned due diligence.
          </div>
        </div>

        {/* Bottom row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 1,
            fontSize: 20,
            fontWeight: 600,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#F2B83E",
                }}
              />
              CCC Licensed 2025/26
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#F2B83E",
                }}
              />
              15 years in commodities
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#F2B83E",
                }}
              />
              4 sustainability pillars
            </div>
          </div>
          <div
            style={{
              fontWeight: 700,
              letterSpacing: "0.04em",
            }}
          >
            asondo.ci
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
