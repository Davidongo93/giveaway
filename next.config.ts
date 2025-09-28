import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'a0.muscache.com', 'scontent-mia3-1.xx.fbcdn.net'],
  },
};

export default nextConfig;
