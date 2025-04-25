import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['images.unsplash.com', 'localhost'],
    formats: ['image/avif', 'image/webp']
  },
  reactStrictMode: true,
  swcMinify: true
};

export default nextConfig;
