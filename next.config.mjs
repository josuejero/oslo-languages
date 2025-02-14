import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path'; // For resolving paths
import { fileURLToPath } from 'url'; // To support ESM __dirname

// Added import to enable CommonJS require in an ESM module
import { createRequire } from 'module';
const require = createRequire(import.meta.url); // Define require for use in this file

// Define __filename and __dirname for ESM compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import webpack from 'next/dist/compiled/webpack/webpack-lib.js'; // Use Next.js's compiled webpack

// Define security headers for all routes
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com",
      "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com",
      "img-src 'self' data: https: blob:",
      "font-src 'self' https://cdnjs.cloudflare.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "block-all-mixed-content",
      "upgrade-insecure-requests"
    ].join('; ')
  }
];

/**
 * Next.js configuration object.
 *
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  // Removed unsupported 'server' key.
  // For server-specific configuration, consider a custom server setup.

  // Configure redirects for admin routes
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/login', permanent: true }
    ];
  },

  // Set global headers
  async headers() {
    return [
      { source: '/:path*', headers: securityHeaders }
    ];
  },

  // Next.js Image Optimization settings
  images: {
    domains: [
      'loremflickr.com',
      'cloudflare-ipfs.com',
      'avatars.githubusercontent.com',
      'picsum.photos',
      'fastly.picsum.photos'
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Cache configuration for on-demand entries
  onDemandEntries: {
    maxInactiveAge: 25 * 1000, // Keep pages for 25 seconds
    pagesBufferLength: 2,      // Number of pages to keep in buffer
  },

  // Enable compression for responses
  compress: true,

  // Enable source maps in production for better error tracking
  productionBrowserSourceMaps: true,

  // Customize webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Alias "remark-github-blockquote-alert" so nested dependencies resolve correctly
    config.resolve.alias['remark-github-blockquote-alert'] =
      require.resolve('remark-github-blockquote-alert'); // Using require.resolve via createRequire

    // Force resolution of "remark-github-blockquote-alert" using NormalModuleReplacementPlugin
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^remark-github-blockquote-alert$/,
        require.resolve('remark-github-blockquote-alert') // Updated replacement using require.resolve
      )
    );

    if (!dev && !isServer) {
      // Enable React profiling in production for performance insights
      config.resolve.alias['react-dom$'] = 'react-dom/profiling';
      config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';

      // Configure minification and chunk splitting
      config.optimization = {
        ...config.optimization,
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
          minChunks: 1,
          maxAsyncRequests: 30,
          maxInitialRequests: 30,
          automaticNameDelimiter: '~',
          enforceSizeThreshold: 50000,
          cacheGroups: {
            defaultVendors: {
              test: /[\\/]node_modules[\\/]/,
              priority: -10
            },
            default: {
              minChunks: 2,
              priority: -20,
              reuseExistingChunk: true
            }
          }
        }
      };
    }
    return config;
  },

  // Moved transpilePackages out of experimental as per Next.js v14 guidelines
  transpilePackages: ['remark-github-blockquote-alert', 'rehype-prism-plus'],

  // Build-time optimizations in experimental features
  experimental: {
    optimizeCss: true, // Enable CSS optimization
    optimizePackageImports: ['@mui/icons-material', '@mui/material', 'date-fns'],
    esmExternals: false, // Disable ESM externalization to force bundling of ESM modules as CommonJS
  },
};

// Enable bundle analysis in production builds
const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer(nextConfig);
