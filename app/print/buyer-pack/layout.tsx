import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./styles.css";

/**
 * Print layout — completely separate from the public site chrome.
 *
 * - No <Navbar/> / <Footer/> / <Toaster/>: this tree is rendered by
 *   Puppeteer in headless Chrome, snapshotted to PDF, then thrown away.
 * - We load Inter + Fraunces via `next/font/google` so the binary fonts
 *   are auto-inlined into the served HTML, guaranteeing deterministic
 *   rendering server-side without any /public/fonts asset to ship.
 * - Excluded from sitemap / robots: see `app/robots.ts` (or add a
 *   <meta name="robots" content="noindex"/> below to be defensive).
 */

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Asondo Buyer Assurance Pack",
  description: "Internal print route. Renders the Buyer Assurance Pack PDF.",
  robots: { index: false, follow: false, nocache: true },
};

export default function PrintLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable}`}>
      <head>
        <meta name="robots" content="noindex,nofollow,noarchive" />
      </head>
      <body>{children}</body>
    </html>
  );
}
