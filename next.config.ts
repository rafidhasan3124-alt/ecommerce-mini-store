import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  devIndicators: false,
  // Allow ngrok tunnels (and any other external dev proxy) to access this dev server.
  // Next.js 16 blocks cross-origin requests to dev assets by default.
  // These wildcard entries cover the full range of free and paid ngrok domains.
  allowedDevOrigins: [
    '*.ngrok-free.app',
    '*.ngrok-free.dev',
    '*.ngrok.app',
    '*.ngrok.io',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.shopify.com' },
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'i.imgur.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: '**.cloudinary.com' },
    ],
  },
};

export default nextConfig;
