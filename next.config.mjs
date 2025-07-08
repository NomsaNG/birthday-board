/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  output: 'standalone', // Required for Netlify deployment
  experimental: {
    appDir: true, // Enable experimental app directory support
  },
  
}

export default nextConfig
