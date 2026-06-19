/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chasehorse/shared'],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'chasehorse.odoo.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
