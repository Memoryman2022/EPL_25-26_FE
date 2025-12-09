/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    optimizeCss: false, // keeps LightningCSS off
  },
};

module.exports = nextConfig;