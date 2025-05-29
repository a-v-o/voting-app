import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "x8cpqwl40unr4rgu.public.blob.vercel-storage.com",
        port: "",
      },
    ],
  },
};

export default nextConfig;
