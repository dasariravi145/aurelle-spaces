import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Production-oriented Next.js configuration compatible with Cloudflare Workers runtime
  reactStrictMode: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
