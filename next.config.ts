import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'assets.coingecko.com',
      'coins.coingecko.com',
      'coin-images.coingecko.com'
    ],
  },
};

export default nextConfig;
