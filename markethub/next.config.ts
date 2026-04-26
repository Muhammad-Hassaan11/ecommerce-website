import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable React Compiler in dev — adds significant compilation overhead
  reactCompiler: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  experimental: {
    // Tree-shake lucide-react — it has 1000+ icon exports
    optimizePackageImports: ["lucide-react"],
  },
};

export default nextConfig;
