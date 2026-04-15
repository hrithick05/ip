/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "@clerk/nextjs"]
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  }
};

export default nextConfig;
