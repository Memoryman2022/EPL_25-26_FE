/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'placehold.co', // Add this line for the placeholder images
      // Add any other external image domains your app uses (e.g., 'example.com', 'another-cdn.net')
    ],
  },
};

module.exports = nextConfig;