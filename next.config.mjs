/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Cuts dev compile time significantly: instead of bundling the whole package,
  // Next rewrites `import { Icon } from "lucide-react"` into a deep import,
  // so only the icons actually used hit webpack. Same for framer-motion.
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "sonner",
      "@google/generative-ai",
    ],

    // Keep heavy serverless-only deps OUT of the Next.js bundle:
    //   - @sparticuz/chromium ships a ~60 MB Lambda-compatible Chromium
    //     binary. Bundling it (or even tracing it) on a developer laptop
    //     would slow down builds AND break the build when the package is
    //     not installed locally. Listing it here tells Next to require it
    //     natively at runtime instead — Vercel installs it via package.json
    //     before the function runs, exactly when it's needed.
    //   - puppeteer-core is a pure-JS controller, but Next can also bundle
    //     it more efficiently as an external dep (avoids the 'fs'/'path'
    //     dynamic-require warnings during build).
    serverComponentsExternalPackages: [
      "@sparticuz/chromium",
      "puppeteer-core",
    ],
  },

  // /login is a friendly alias for the admin console. Handled at the routing
  // layer (not as a real page) so it doesn't compile a separate route in dev.
  async redirects() {
    return [
      {
        source: "/login",
        destination: "/console/login",
        permanent: false,
      },
    ];
  },

  // Windows dev workaround: webpack's file watcher tries to lstat the whole
  // drive root, which fails on `C:\System Volume Information`, `hiberfil.sys`
  // and `swapfile.sys`. Telling it to ignore those + node_modules speeds up
  // the initial scan and removes the misleading Watchpack errors.
  webpack(config, { isServer }) {
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      ignored: [
        "**/node_modules/**",
        "**/.next/**",
        "**/.git/**",
        "C:/System Volume Information/**",
        "C:/hiberfil.sys",
        "C:/swapfile.sys",
        "C:/pagefile.sys",
      ],
    };

    // API route handlers are NOT covered by `experimental.serverComponentsExternalPackages`
    // in Next 14 — that flag only affects Server Components. We need to mark
    // `@sparticuz/chromium` as a native CommonJS external for the server bundle
    // so webpack doesn't try to resolve it at build time on a developer machine
    // where the package may not be installed. Vercel installs it via package.json
    // and Node loads it via a real `require()` at runtime only on the serverless
    // code path (`IS_VERCEL === true`).
    if (isServer) {
      const existing = Array.isArray(config.externals)
        ? config.externals
        : config.externals
          ? [config.externals]
          : [];
      config.externals = [
        ...existing,
        {
          "@sparticuz/chromium": "commonjs @sparticuz/chromium",
        },
      ];
    }

    return config;
  },
};

export default nextConfig;
