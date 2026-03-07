import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Keep dev artifacts separate from production build artifacts to avoid
  // ENOENT races when files are edited while other Next commands are running.
  distDir: isDevelopment ? ".next-dev" : ".next",
};

export default nextConfig;
