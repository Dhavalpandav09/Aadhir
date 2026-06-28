/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow <img> tags with external URLs (Cloudinary, Unsplash)
  images: {
    unoptimized: true,
  },
  // Proxy /api/* → Express backend so no CORS issues
  async rewrites() {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    return [
      {
        source: '/api/:path*',
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
