/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Tree-shake large barrel packages so only the used exports are bundled.
    optimizePackageImports: ['@react-three/drei', '@react-three/fiber', 'three'],
  },
  async redirects() {
    return [
      {
        // Duplicate-topic post merged into how-to-run-a-business-operations-assessment on 2026-08-19.
        source: '/blog/business-operations-assessment-find-the-bottlenecks-before-you-automate',
        destination: '/blog/how-to-run-a-business-operations-assessment',
        permanent: true,
      },
    ];
  },
};
module.exports = nextConfig;
