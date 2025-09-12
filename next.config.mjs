/** @type {import('next').NextConfig} */
import removeImports from 'next-remove-imports';

const nextConfig = removeImports()({
  experimental: {
    esmExternals: 'loose'
  },
  images: {
    domains: [], // Add external domains here if needed
    unoptimized: false, // Set to true if you want to disable image optimization
  }
});

export default nextConfig;
