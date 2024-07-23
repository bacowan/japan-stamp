/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'leafletjs.com',
          port: '',
          pathname: '/docs/images/**',
        },
        {
          protocol: 'http',
          hostname: '127.0.0.1',
          port: '9199',
          pathname: '/v0/b/japan-stamp.appspot.com/**',
        }
      ],
    },
};

export default nextConfig;