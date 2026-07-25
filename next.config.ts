import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true
  },
  // Base path for deployment
  basePath: '',
  // Trailing slash for compatibility
  trailingSlash: true,
};

export default nextConfig;
