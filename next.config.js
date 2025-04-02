// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    domains: [
      'loremflickr.com',
      'cloudflare-ipfs.com',
      'avatars.githubusercontent.com',
      'picsum.photos',
      'fastly.picsum.photos'
    ]
  },
  // Simplified webpack configuration: simply return the default config
  webpack: (config) => config,
};

module.exports = nextConfig;
