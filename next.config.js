/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  distDir: process.env.NEXT_DIST_DIR || '.next',
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Tree-shake large barrel packages so only the used exports are bundled.
    optimizePackageImports: ['@react-three/drei', '@react-three/fiber', 'three'],
  },
  images: {
    // Blog thumbnails are stored as absolute aivory.uk/.id URLs (legacy
    // posts may still point at the old domain) — both need allowing for
    // next/image to optimize (resize + webp/avif negotiation) them.
    remotePatterns: [
      { protocol: 'https', hostname: 'aivory.uk' },
      { protocol: 'https', hostname: 'www.aivory.uk' },
      { protocol: 'https', hostname: 'aivory.id' },
      { protocol: 'https', hostname: 'www.aivory.id' },
    ],
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
