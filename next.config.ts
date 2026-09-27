import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: "/products/**" }, { pathname: "/media/**" }, { pathname: "/brand/**" }, { pathname: "/api/media/**" }],
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: ["pg"],
  experimental: { serverActions: { bodySizeLimit: "12mb" } },
};

export default nextConfig;
