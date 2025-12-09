/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    optimizeCss: false, // Fix lightningcss build failure on Netlify
  },
};

module.exports = nextConfig;
