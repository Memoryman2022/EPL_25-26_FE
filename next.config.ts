/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    optimizeCss: false, // avoids LightningCSS binary issues on Netlify
  },
};

module.exports = nextConfig;
