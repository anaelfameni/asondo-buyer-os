"use client";

import { useEffect } from "react";

/**
 * Critical assets that should be in cache before we let the page show.
 * Keep this list short (top of the visible fold + key visual elements).
 * Anything that fails to load is silently skipped so a missing file
 * never blocks the splash from clearing.
 */
const CRITICAL_ASSETS: readonly string[] = [
  "/backgroundhero.jpg",
  "/asondologocomplet.PNG",
  "/CCClogo.jpg",
  "/FCClogo.jpg",
  "/RainforestAllianceLogo.png",
];

/**
 * Minimum duration the splash stays on screen (ms). Avoids the harsh
 * "instant flicker" effect when everything is already cached.
 */
const MIN_DURATION_MS = 700;

/**
 * Maximum duration before we force-hide the splash (ms). Defensive
 * upper bound so a slow third-party asset never traps the user behind
 * the loader forever.
 */
const MAX_DURATION_MS = 6000;

/**
 * Client gate that hides the inline `#site-loader` splash once the
 * page is genuinely ready (window load + fonts ready + critical
 * images preloaded). Mounted as a sibling of the splash in the root
 * layout so it runs as soon as React hydrates.
 *
 * Renders nothing — it's pure side effect.
 */
export function SiteReadyGate() {
  useEffect(() => {
    const loader = document.getElementById("site-loader");
    if (!loader) return;

    let disposed = false;

    const hide = () => {
      if (disposed) return;
      disposed = true;
      loader.classList.add("site-loader--hide");
      // Wait for the CSS fade transition then remove from DOM so it
      // can never intercept clicks or screen-reader focus.
      window.setTimeout(() => loader.remove(), 600);
    };

    const start = performance.now();

    const preloadOne = (src: string) =>
      new Promise<void>((resolve) => {
        const img = new window.Image();
        img.onload = () => resolve();
        img.onerror = () => resolve();
        img.src = src;
      });

    const windowLoaded = new Promise<void>((resolve) => {
      if (document.readyState === "complete") {
        resolve();
        return;
      }
      window.addEventListener("load", () => resolve(), { once: true });
    });

    const fontsReady =
      typeof document !== "undefined" && "fonts" in document
        ? document.fonts.ready.then(() => undefined)
        : Promise.resolve();

    Promise.all([
      windowLoaded,
      fontsReady,
      ...CRITICAL_ASSETS.map(preloadOne),
    ]).then(() => {
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_DURATION_MS - elapsed);
      window.setTimeout(hide, wait);
    });

    // Defensive timer — never trap the visitor behind the splash.
    const safety = window.setTimeout(hide, MAX_DURATION_MS);

    return () => {
      window.clearTimeout(safety);
    };
  }, []);

  return null;
}
