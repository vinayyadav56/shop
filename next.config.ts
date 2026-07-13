import type { NextConfig } from 'next';

/**
 * plantathome-shop — V1 pixel-port on Next 16 App Router.
 * API + image + proxy config mirror V1's next.config.js; compat module aliases
 * back the tsconfig path redirects at the bundler level (Turbopack).
 */

const COMPAT_ALIASES = {
  'react-query': './src/compat/react-query.tsx',
  'react-query/hydration': './src/compat/react-query-hydration.tsx',
  'next-i18next': './src/compat/next-i18next.tsx',
  'react-i18next': './src/compat/next-i18next.tsx',
  'next-seo': './src/compat/next-seo.tsx',
  'next/router': './src/compat/next-router.ts',
  'next-auth/react': './src/compat/next-auth-react.tsx',
};

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Same-origin API proxy (mirrors V1's Vercel rewrite): the browser calls
  // /rest-api on this host; Next proxies to the legacy marvel API. SSR calls
  // the API directly via NEXT_PUBLIC_REST_API_ENDPOINT.
  async rewrites() {
    const target =
      process.env.NEXT_PUBLIC_REST_API_ENDPOINT ||
      'https://plantathome-production.up.railway.app/api';
    return [{ source: '/rest-api/:path*', destination: `${target}/:path*` }];
  },
  async redirects() {
    return [
      { source: '/shops', destination: '/', permanent: true },
      { source: '/shops/:path*', destination: '/', permanent: true },
    ];
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'plantathome-media-prod.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'plantathome.s3.ap-south-1.amazonaws.com' },
      { protocol: 'https', hostname: 'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com' },
      { protocol: 'https', hostname: 'pixarlaravel.s3.ap-southeast-1.amazonaws.com' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 's3.amazonaws.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plantathome-production.up.railway.app' },
      { protocol: 'https', hostname: 'api.plantathome.in' },
      { protocol: 'http', hostname: 'localhost' },
      { protocol: 'http', hostname: '127.0.0.1' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [360, 480, 640, 750, 828, 1080, 1200, 1920],
    imageSizes: [120, 160, 200, 256, 320, 384],
    minimumCacheTTL: 2592000,
  },
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    optimizePackageImports: ['framer-motion', 'lodash', '@headlessui/react'],
  },
  turbopack: {
    resolveAlias: COMPAT_ALIASES,
  },
  async headers() {
    return [
      {
        source: '/:dir(images|brand|fonts|icons)/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
};

export default nextConfig;
