/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [],
  },
  experimental: {
    optimizeCss: false, // avoids LightningCSS binary issues on Netlify
  },
};

export default nextConfig;
