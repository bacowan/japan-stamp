import nextTranslate from 'next-translate-plugin';

/** @type {import('next').NextConfig} */
const nextConfig = {
    compiler: {
        styledComponents: true,
    },
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

export default nextTranslate(nextConfig);
