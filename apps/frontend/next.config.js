/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  // transpilePackages: ["@transcendence/types"],
};

module.exports = nextConfig;
