/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    optimizeCss: false, // optional, keeps LightningCSS off
  },
  // Force Webpack for production builds
  turbo: false,
};

module.exports = nextConfig;
