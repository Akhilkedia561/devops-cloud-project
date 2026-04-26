import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/backend/:path*",
        destination: "http://backend:5000/:path*",
      },
    ];
  },
};
export default nextConfig;