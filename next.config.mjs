/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['en-US', 'jp'],
    defaultLocale: 'en-US',
  },
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
