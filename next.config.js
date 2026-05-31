/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

// const runtimeCaching = require('next-pwa/cache');
// const withPWA = require('next-pwa')({
//   disable: process.env.NODE_ENV === 'development',
//   dest: 'public',
//   runtimeCaching,
// });

module.exports = {
  reactStrictMode: true,
  i18n,
  // Browser API calls go to /rest-api on this same Vercel domain (reachable by all
  // users), and Vercel proxies them server-side to Railway. This avoids the case
  // where a user's network cannot reach *.up.railway.app directly. SSR keeps calling
  // Railway directly (Vercel's network can reach it).
  async rewrites() {
    const target =
      process.env.NEXT_PUBLIC_REST_API_ENDPOINT ||
      'https://plantathome-production.up.railway.app/api';
    return [{ source: '/rest-api/:path*', destination: `${target}/:path*` }];
  },
  images: {
    domains: [
      'plantathome-media-prod.s3.ap-south-1.amazonaws.com',
      'plantathome.s3.ap-south-1.amazonaws.com',
      'pickbazarlaravel.s3.ap-southeast-1.amazonaws.com',
      'pixarlaravel.s3.ap-southeast-1.amazonaws.com',
      'lh3.googleusercontent.com',
      'localhost',
      '127.0.0.1',
      'res.cloudinary.com',
      's3.amazonaws.com',
      'via.placeholder.com',
      'images.unsplash.com',
    ],
  },
  ...(process.env.FRAMEWORK_PROVIDER === 'graphql' && {
    webpack(config, options) {
      config.module.rules.push({
        test: /\.graphql$/,
        exclude: /node_modules/,
        use: [options.defaultLoaders.babel, { loader: 'graphql-let/loader' }],
      });

      config.module.rules.push({
        test: /\.ya?ml$/,
        type: 'json',
        use: 'yaml-loader',
      });

      return config;
    },
  }),
  ...(['production', 'staging'].includes(process.env.APPLICATION_MODE) && {
    typescript: {
      ignoreBuildErrors: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  }),
};
