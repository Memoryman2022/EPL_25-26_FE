/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    turbo: false,
    optimizeCss: false, // Fix lightningcss build failure on Netlify
  },
};

module.exports = nextConfig;
