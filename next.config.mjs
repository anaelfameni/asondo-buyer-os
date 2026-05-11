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
  webpack(config) {
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
    return config;
  },
};

export default nextConfig;
