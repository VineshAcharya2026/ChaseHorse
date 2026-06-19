/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@chasehorse/shared', '@chasehorse/auth-client', '@chasehorse/core'],
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

module.exports = nextConfig;
