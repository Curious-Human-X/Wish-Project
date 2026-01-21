/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos', // Allow placeholder images
      },
      // Add other domains here if you use real photos from the web
    ],
  },
};

export default nextConfig;