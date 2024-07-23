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
      ],
    },
};

export default nextConfig;