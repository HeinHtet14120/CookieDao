/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/cookie/:path*",
        destination: "https://api.cookie.fun/:path*",
      },
      {
        source: "/api/backend/:path*", // Proxy API requests
        destination: "https://cookiedao-production-1847.up.railway.app/:path*",
      },
    ];
  },
  images: {
    domains: [
      "raw.githubusercontent.com",
      "api.dicebear.com",
      "cache.jup.ag",
      "images.unsplash.com",
    ],
  },
};

module.exports = nextConfig;
