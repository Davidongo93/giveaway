import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'a0.muscache.com', 'scontent-mia3-1.xx.fbcdn.net', 'scontent-cdg4-2.xx.fbcdn.net', 'i.ytimg.com', 'example.com'],
  },
};

export default nextConfig;
