import Image from "next/image";

/**
 * Editorial-style background image for content sections.
 *
 * Used to layer one of the brand photographs (`/photo1.jpg` … `/photo5.jpg`)
 * behind a `<section>` without competing with the section's text or the
 * orange brand identity. The hero of every page is intentionally left
 * untouched — backgrounds only appear in body sections.
 *
 * How it stacks
 * -------------
 * Inside the parent `<section>` (which must be `relative` and
 * `overflow-hidden`), this component renders three layers at `z-0`:
 *
 *   1. The photograph itself (`object-cover`, `priority={false}` so it
 *      never competes with the LCP hero).
 *   2. A solid tint at high opacity so the page reads as part of the
 *      Asondo identity, not a stock photo. The tint colour matches the
 *      section's surrounding background (`#FDFBF7` cream by default,
 *      `#1F3D2F` for the dark-green CTAs).
 *   3. A vertical fade in the same colour so the photo edge never
 *      collides hard with neighbouring sections.
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
  tint,
  position = "center",
}: {
  src: string;
  alt?: string;
  /**
   * Tint preset matching the surrounding section background. `cream`
   * is the default Asondo body colour (`#FDFBF7`). `dark` matches the
   * deep-green CTAs (`#1F3D2F`).
   */
  variant?: "cream" | "dark";
  /**
   * Optional override for the tint opacity (0..1). Higher values fade
   * the photo more. Defaults are tuned per variant to keep text
   * readable without removing the photographic atmosphere.
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

  const tintColor = variant === "dark" ? "31, 61, 47" : "253, 251, 247";
  const tintAlpha = tint ?? (variant === "dark" ? 0.78 : 0.86);
  const fadeStop = variant === "dark" ? "#0F2619" : "#FDFBF7";

  return (
    <div aria-hidden className="absolute inset-0 z-0 pointer-events-none">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="100vw"
        quality={70}
        className={`object-cover ${objectPosition}`}
      />

      <div
        className="absolute inset-0"
        style={{ backgroundColor: `rgba(${tintColor}, ${tintAlpha})` }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, ${fadeStop} 0%, transparent 18%, transparent 82%, ${fadeStop} 100%)`,
        }}
      />
    </div>
  );
}
