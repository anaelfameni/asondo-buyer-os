import Image from "next/image";

/**
 * Editorial-style background image for content sections.
 *
 * Used to layer one of the brand photographs (`/photo1.jpg` … `/photo5.jpg`)
 * behind a `<section>` with the **same green → burnt-orange → light-orange
 * overlay as the home `HeroBanner` and `PageHero`** so every section reads
 * as part of the unified Asondo identity. Heroes themselves stay
 * untouched — backgrounds only appear in body sections.
 *
 * How it stacks
 * -------------
 * Inside the parent `<section>` (which must be `relative` and
 * `overflow-hidden`), this component renders four layers at `z-0`:
 *
 *   1. The photograph itself (`object-cover`, `priority={false}`).
 *   2. The Asondo signature gradient overlay
 *      (`from-[#1F3D2F]/85 via-[#D06B1F]/65 to-[#E8833D]/50`) — same
 *      colours and stops as `PageHero`.
 *   3. An optional extra cream/dark tint controlled by `tint`. Used by
 *      `LegalShell` to soften the gradient further on text-dense
 *      legal-prose pages.
 *   4. A top/bottom cream/dark fade so the section never collides hard
 *      with neighbouring sections.
 *
 * Section authors are responsible for keeping their own content above
 * this background. Any positive `z-` works; the existing decorative
 * orbs and content containers in our sections already paint after this
 * `z-0` block in DOM order, so they sit on top automatically.
 */
export function SectionBackground({
  src,
  alt = "",
  variant = "cream",
  tint = 0,
  position = "center",
}: {
  src: string;
  alt?: string;
  /**
   * Fade preset matching the surrounding section background. `cream`
   * is the default Asondo body colour (`#FDFBF7`). `dark` matches the
   * deep-green CTAs (`#1F3D2F`). Only affects the top/bottom fade —
   * the main overlay is the brand gradient regardless.
   */
  variant?: "cream" | "dark";
  /**
   * Optional extra cream/dark veil on top of the brand gradient (0..1).
   * 0 = brand gradient only (default, full Asondo orange/green look).
   * Use a positive value (e.g. 0.4) on text-dense legal pages to mute
   * the saturation and keep paragraph copy easy to read.
   */
  tint?: number;
  /**
   * Position of the focal point inside the photo. `center` works for
   * most of the cocoa images; `top` is useful when the subject sits in
   * the upper third (drying racks viewed from above, etc.).
   */
  position?: "center" | "top" | "bottom";
}) {
  const objectPosition =
    position === "top"
      ? "object-top"
      : position === "bottom"
      ? "object-bottom"
      : "object-center";

  const fadeStop = variant === "dark" ? "#0F2619" : "#FDFBF7";
  const veilColor = variant === "dark" ? "31, 61, 47" : "253, 251, 247";

  return (
    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        // 85 keeps the cocoa-bean / pod close-ups crisp now that the
        // photograph is clearly visible behind the brand gradient.
        quality={85}
        className={`object-cover ${objectPosition}`}
      />

      {/* Asondo signature green → burnt-orange → light-orange gradient,
          identical to the home HeroBanner / PageHero overlay so every
          section reads as part of the same brand identity. */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1F3D2F]/85 via-[#D06B1F]/65 to-[#E8833D]/50" />

      {/* Optional extra cream/dark veil for text-dense pages. */}
      {tint > 0 ? (
        <div
          className="absolute inset-0"
          style={{ backgroundColor: `rgba(${veilColor}, ${tint})` }}
        />
      ) : null}

      {/* Top + bottom fade into the surrounding section colour so the
          photograph never has a hard edge against neighbouring content. */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${fadeStop} 0%, transparent 18%, transparent 82%, ${fadeStop} 100%)`,
        }}
      />
    </div>
  );
}
