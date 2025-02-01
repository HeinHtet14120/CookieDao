/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/cookie/:path*',
        destination: 'https://api.cookie.fun/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
