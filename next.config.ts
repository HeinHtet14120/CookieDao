/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/cookie/:path*",
        destination: "https://api.cookie.fun/:path*",
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
