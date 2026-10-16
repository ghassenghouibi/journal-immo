import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // un package-lock.json existe dans le dossier parent : fixer la racine du projet
  outputFileTracingRoot: __dirname,
  turbopack: { root: __dirname },
  images: { formats: ['image/avif', 'image/webp'] }
};

export default nextConfig;
