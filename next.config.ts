import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  experimental: {
    // Allow issue photo uploads up to the API route limit (5MB).
    proxyClientMaxBodySize: "5mb",
    serverActions: {
      bodySizeLimit: "5mb",
    },
  },
};

export default nextConfig;
