/**
 * Twitter card image for the Asondo site.
 *
 * The Open Graph image already follows the recommended 1200×630
 * format (`summary_large_image` is happy with that). Twitter
 * scrapers accept the OG fallback when no `twitter-image.*` is
 * present, but providing this file means Next emits an explicit
 * `twitter:image` meta tag pointing to a stable URL, which is more
 * reliable across crawlers.
 *
 * We forward to the default OG generator so the same artwork is
 * served — there is no business reason to diverge today. The
 * `runtime`, `alt`, `size`, and `contentType` exports must be
 * **string literals at the top level** because Next.js statically
 * analyses them at build time (re-exporting from another module
 * fails the analyser, hence the explicit duplication below).
 */
import OgImage, {
  alt as ogAlt,
  size as ogSize,
  contentType as ogContentType,
} from "./opengraph-image";

export const runtime = "edge";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;

export default OgImage;
