// src/pages/robots.ts
import { MetadataRoute } from 'next';

/**
 * Generates a robots.txt configuration object for the Next.js application.
 *
 * This file controls how search engines and other web robots crawl the site.
 * It specifies which parts of the site should be crawled and which should be ignored.
 *
 * @returns {MetadataRoute.Robots} The robots.txt configuration object.
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

interface RobotsRule {
  userAgent: string;
  allow?: string | string[];
  disallow?: string | string[];
  crawlDelay?: number;
}

// Define specific rules for different bot types
const rules: RobotsRule[] = [
  // General rules for all bots
  {
    userAgent: '*',
    allow: [
      '/',
      '/about',
      '/courses',
      '/contact',
      '/sitemap.xml',
    ],
    disallow: [
      '/api/',
      '/private/',
      '/admin/',
      '/*?*', // Block URLs with query parameters
      '/*.json$', // Block JSON files
      '/*.php$', // Block PHP files
      '/wp-*', // Block any WordPress-related URLs
      '/*/feed/', // Block feed URLs
      '*/trackback/', // Block trackback URLs
      '/cdn-cgi/', // Block Cloudflare system files
      '/.git/', // Block git directory
      '/.env', // Block environment files
      '/node_modules/',
      '/error',
      '/_next/static/development/', // Block Next.js development files
      '/draft/', // Block draft pages
      '/preview/', // Block preview pages
      '/assets/private/', // Block private assets
    ],
    crawlDelay: 1, // 1 second delay between requests
  },

  // Stricter rules for archive bots
  {
    userAgent: 'archive.org_bot',
    allow: '/',
    disallow: [
      '/private/',
      '/api/',
      '/admin/',
      '/members/',
      '/account/',
    ],
    crawlDelay: 3,
  },

  // Block GPTBot by default (prevent AI training on your content)
  {
    userAgent: 'GPTBot',
    disallow: '/',
  },

  // Block ChatGPT Plugin
  {
    userAgent: 'ChatGPT-User',
    disallow: '/',
  },

  // Block Google-Extended
  {
    userAgent: 'Google-Extended',
    disallow: '/',
  },

  // Rules for Bing Bot
  {
    userAgent: 'bingbot',
    allow: '/',
    disallow: [
      '/api/',
      '/admin/',
      '/private/',
      '/*.json$',
    ],
    crawlDelay: 1,
  },

  // Rules for Google Bot
  {
    userAgent: 'Googlebot',
    allow: [
      '/', 
      '/courses/',
      '/sitemap.xml',
    ],
    disallow: [
      '/*.json$',
      '/api/',
      '/private/',
      '/admin/',
      '/draft/',
      '/preview/',
    ],
  },

  // Rules for Google Image Bot
  {
    userAgent: 'Googlebot-Image',
    allow: [
      '/images/',
      '/photos/',
      '/assets/public/',
    ],
    disallow: [
      '/assets/private/',
      '/placeholder/',
    ],
  },
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules,
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}