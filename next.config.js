/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
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
