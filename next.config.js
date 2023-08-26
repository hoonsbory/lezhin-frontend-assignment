/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ccdn.lezhin.com',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/ranking?genre=romance',
        basePath: false,
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
