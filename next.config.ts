// next.config.ts
import type { NextConfig } from "next";
import withBundleAnalyzer from '@next/bundle-analyzer';


const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    domains: [
      'loremflickr.com',
      'cloudflare-ipfs.com',
      'avatars.githubusercontent.com',
      'picsum.photos',
      'fastly.picsum.photos',
    ],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Add cache configuration
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
    // Enable compression
    compress: true,

    // Enable source maps in production for better error tracking
    productionBrowserSourceMaps: true,
  
    // Add webpack optimizations
    webpack: (config, { dev, isServer }) => {
      // Only run in production client-side builds
      if (!dev && !isServer) {
        // Enable React profiling in production
        config.resolve.alias['react-dom$'] = 'react-dom/profiling';
        config.resolve.alias['scheduler/tracing'] = 'scheduler/tracing-profiling';
  
        // Minify JavaScript
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
  
    // Add build-time optimizations
    experimental: {
      optimizeCss: true, // enables CSS optimization
      optimizePackageImports: ['@mui/icons-material', '@mui/material', 'date-fns'],
    },
  };
  
  // Enable bundle analysis in production
  const withAnalyzer = withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  });
  
  export default withAnalyzer(nextConfig);