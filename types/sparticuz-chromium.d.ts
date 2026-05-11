/**
 * Ambient type declaration for `@sparticuz/chromium`.
 *
 * Why this file exists
 * --------------------
 * `@sparticuz/chromium` is a serverless-only dependency: it ships a Lambda /
 * Vercel-compatible Chromium binary that we only ever launch when running
 * inside a Vercel function (see `IS_VERCEL` gate in
 * `app/api/buyer-pack/route.ts`). On a developer laptop we never load it.
 *
 * To keep `pnpm install` lean on the dev machine, the package is **not**
 * required to be physically present in `node_modules` locally — it's marked
 * as a webpack external in `next.config.mjs` so Next.js leaves the
 * `import("@sparticuz/chromium")` call as a native `require()` resolved at
 * runtime. Vercel installs it during deployment via `package.json` and Node
 * picks it up there.
 *
 * The package itself ships zero `.d.ts` files. Without this declaration we
 * are stuck between two failing states:
 *
 *   • Local build: TS sees "Cannot find module '@sparticuz/chromium'"
 *     and would force us to add `@ts-expect-error`.
 *   • Vercel build: the package IS installed, TS resolves the import for
 *     real, and `@ts-expect-error` becomes "Unused directive" → build fails.
 *   • ESLint config bans `@ts-ignore` in favor of `@ts-expect-error`.
 *
 * Declaring the module ambient-style here makes TypeScript happy in both
 * environments without any inline suppression.
 *
 * The shape mirrors the public runtime API documented at
 * https://github.com/Sparticuz/chromium#api — kept narrow to what we
 * actually call inside `launchServerless()`.
 */
declare module "@sparticuz/chromium" {
  interface ChromiumViewport {
    width: number;
    height: number;
    deviceScaleFactor?: number;
    isMobile?: boolean;
    hasTouch?: boolean;
    isLandscape?: boolean;
  }

  interface ChromiumModule {
    /** Default CLI args tuned for Lambda/Vercel containers. */
    args: string[];
    /** Resolves to the absolute path of the bundled Chromium binary. */
    executablePath: () => Promise<string>;
    /** Recommended default viewport, or `null` to inherit. */
    defaultViewport: ChromiumViewport | null;
    /** Optional helper to toggle between true headless and "shell" mode. */
    setHeadlessMode?: (mode: boolean | "shell") => void;
    /** Optional helper to toggle GPU acceleration. */
    setGraphicsMode?: (enabled: boolean) => void;
  }

  const chromium: ChromiumModule;
  export default chromium;
}
