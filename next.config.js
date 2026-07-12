/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'skytechghana.com',
      },
      {
        protocol: 'https',
        hostname: '**.railway.app',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      }
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  optimizeFonts: false,
};

module.exports = nextConfig;
