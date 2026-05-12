/**
 * Static imports for every photograph used as a hero background.
 *
 * Why this module exists
 * ----------------------
 * Up until now hero shells (`HeroBanner`, `PageHero`, `LegalShell`)
 * passed string paths under `/public/...` straight into next/image.
 * That works for the initial document load (the photo is the LCP and
 * `priority` is honoured), but on a *client-side* navigation —
 * clicking a navbar link to `/eudr`, `/programme`, `/reseau`, etc. —
 * the destination's hero photo is fetched only AFTER the new route's
 * RSC payload arrives and the component mounts. The user reported
 * exactly this: the page contents appear instantly, but the hero
 * stays on the dark green fallback for "quelques secondes" until
 * `/photoN.jpg` finishes downloading.
 *
 * Switching the same photographs to ES module imports lets next/image
 * generate a base64 LQIP (low-quality image placeholder) at build
 * time. That tiny blurred preview is inlined into the HTML, so the
 * hero is fully painted on every navigation the moment React mounts
 * the component, then sharpens to the full-resolution JPEG once it
 * decodes. No more "few-second wait" gap, regardless of CDN cache
 * state.
 *
 * Hero shells call `resolveHeroImage(...)` instead of forwarding the
 * string directly so callers that still pass `"/photoN.jpg"` strings
 * keep working — they get the StaticImageData (and the blur) for
 * free, and unknown strings fall back to the original behaviour.
 */
import type { StaticImageData } from "next/image";

import backgroundheroImg from "@/public/backgroundhero.jpg";
import photo1Img from "@/public/photo1.jpg";
import photo2Img from "@/public/photo2.jpg";
import photo3Img from "@/public/photo3.jpg";
import photo4Img from "@/public/photo4.jpg";
import photo5Img from "@/public/photo5.jpg";

export {
  backgroundheroImg,
  photo1Img,
  photo2Img,
  photo3Img,
  photo4Img,
  photo5Img,
};

/**
 * Lookup of the public path used historically by callers (string
 * `"/foo.jpg"`) → the StaticImageData object next/image needs to
 * emit a blur placeholder. New code should prefer importing the
 * StaticImageData directly, but every existing call site that still
 * passes a string keeps working through `resolveHeroImage`.
 */
const HERO_IMAGE_BY_PATH: Readonly<Record<string, StaticImageData>> = {
  "/backgroundhero.jpg": backgroundheroImg,
  "/photo1.jpg": photo1Img,
  "/photo2.jpg": photo2Img,
  "/photo3.jpg": photo3Img,
  "/photo4.jpg": photo4Img,
  "/photo5.jpg": photo5Img,
};

/**
 * Accepts whatever a hero shell received as `bgImage` and returns a
 * `StaticImageData` whenever possible (blur placeholder eligible).
 *
 * - StaticImageData → returned as-is.
 * - Known string path under `/public` → mapped to the matching static
 *   import.
 * - Unknown string (custom photograph not yet inlined here) →
 *   returned as the original string, so next/image keeps loading it
 *   the legacy way without crashing.
 */
export function resolveHeroImage(
  src: string | StaticImageData
): string | StaticImageData {
  if (typeof src !== "string") return src;
  return HERO_IMAGE_BY_PATH[src] ?? src;
}
