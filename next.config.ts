// next.config.ts
import withBundleAnalyzer from '@next/bundle-analyzer';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import type { NextConfig } from 'next';
import type { Configuration } from 'webpack';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Use Next.js's compiled webpack
import webpack from 'next/dist/compiled/webpack/webpack-lib.js';

// Define security headers for all routes
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age:63072000; includeSubDomains; preload' },
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

// Define the Next.js configuration
const nextConfig: NextConfig = {
  trailingSlash: false,
  reactStrictMode: true,
  poweredByHeader: false,
  async redirects() {
    return [
      { source: '/admin', destination: '/admin/login', permanent: true }
    ];
  },
  async headers() {
    return [
      { 
        source: '/:path*', 
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ]
      }
    ];
  },
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
    formats: ['image/avif', 'image/webp'] as const, // Adding 'as const' to fix the type issue
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  compress: true,
  productionBrowserSourceMaps: true,
  webpack: (config: Configuration, { dev, isServer }: { dev: boolean; isServer: boolean }) => { // Adding type annotations here
    
    // Add resolver for preact-render-to-string to fix next-auth imports
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};
    (config.resolve.alias as Record<string, string | string[]>)['preact-render-to-string'] = require.resolve('preact-render-to-string');
    
    // Production-specific optimizations
    if (!dev && !isServer) {
      // Enable React profiling in production
      (config.resolve.alias as Record<string, string | string[]>)['react-dom$'] = 'react-dom/profiling';
      (config.resolve.alias as Record<string, string | string[]>)['scheduler/tracing'] = 'scheduler/tracing-profiling';

      // Enhanced chunk optimization
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
  // Ensure proper transpilation of problematic packages
  transpilePackages: [
    'remark-github-blockquote-alert', 
    'rehype-prism-plus',
    'micromark',
    'mdast-util-from-markdown'
  ],
  experimental: {
    // Disable optimizeCss to prevent PostCSS errors
    optimizeCss: false,
    optimizePackageImports: ['@mui/icons-material', '@mui/material', 'date-fns'],
  },
  // Enable SWC compiler with Emotion support
  compiler: {
    emotion: true
  }
};

const withAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

export default withAnalyzer(nextConfig);