import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.jp',
        port: '',
        pathname: '/150x150.png',
        search: '',
      }
    ],
  },
};

if (process.env.SUPABASE_URL && process.env.SUPABASE_FILE_PATH) {
  const supabaseUrl = new URL(process.env.SUPABASE_URL);
  const supabasePattern = {
    protocol: supabaseUrl.protocol === "https:" ? "https" : "http" as "https" | "http",
    hostname: supabaseUrl.hostname,
    port: supabaseUrl.port,
    pathname: process.env.SUPABASE_FILE_PATH,
    search: ''
  };
  nextConfig.images?.remotePatterns?.push(supabasePattern);
}
else {
  console.error(`SUPABASE_URL: ${process.env.SUPABASE_URL}`);
  console.error(`SUPABASE_FILE_PATH: ${process.env.SUPABASE_FILE_PATH}`);
  throw "environment variables not correctly configured";
}

const withVercelToolbar = require('@vercel/toolbar/plugins/next')();

export default withVercelToolbar(nextConfig);
