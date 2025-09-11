/** @type {import('next').NextConfig} */
import removeImports from 'next-remove-imports';

const nextConfig = removeImports()({
  experimental: {
    esmExternals: 'loose'
  }
});

export default nextConfig;
