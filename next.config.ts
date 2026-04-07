import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse relies on Node-only modules (fs, child_process, etc.).
  // Tell webpack to ignore them so the server bundle doesn't break during
  // tree-shaking or when Next.js tries to analyse the module graph.
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      // Keep pdf-parse out of the webpack bundle entirely -- it runs only in
      // Node API routes where require() just works.
      (config.externals as string[]).push("pdf-parse");
    }
    return config;
  },
};

export default nextConfig;
