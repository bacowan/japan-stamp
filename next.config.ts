import type { NextConfig } from "next";
import { hostname } from "os";

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
else if (!process.env.SUPABASE_URL) {
  throw "SUPABASE_URL is not configured";
}
else {
  throw "SUPABASE_FILE_PATH is not configured";
}

export default nextConfig;
