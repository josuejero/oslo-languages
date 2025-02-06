// src/app/sitemap.ts
import { MetadataRoute } from 'next';

// Types
type SitemapFrequency = 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

interface SitemapEntry {
  url: string;
  lastModified?: string | Date;
  changeFrequency?: SitemapFrequency;
  priority?: number;
}

// Configuration
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';

const COURSE_SLUGS = [
  'norwegian-beginner',
  'norwegian-intermediate',
  'business-english',
  'spanish-beginner',
] as const;

const STATIC_ROUTES = {
  HOME: {
    url: '',
    changeFreq: 'daily' as const,
    priority: 1.0,
  },
  ABOUT: {
    url: 'about',
    changeFreq: 'monthly' as const,
    priority: 0.8,
  },
  COURSES: {
    url: 'courses',
    changeFreq: 'weekly' as const,
    priority: 0.9,
  },
  BLOG: {
    url: 'blog',
    changeFreq: 'daily' as const,
    priority: 0.8,
  },
  CONTACT: {
    url: 'contact',
    changeFreq: 'monthly' as const,
    priority: 0.8,
  },
  FAQ: {
    url: 'faq',
    changeFreq: 'monthly' as const,
    priority: 0.7,
  }
} as const;

/**
 * Generates sitemap entries for static pages
 */
function generateStaticPages(): SitemapEntry[] {
  return Object.values(STATIC_ROUTES).map(({ url, changeFreq, priority }) => ({
    url: `${SITE_URL}/${url}`,
    lastModified: new Date().toISOString(),
    changeFrequency: changeFreq,
    priority,
  }));
}

/**
 * Generates sitemap entries for course pages
 */
function generateCoursePages(): SitemapEntry[] {
  return COURSE_SLUGS.map(slug => ({
    url: `${SITE_URL}/courses/${slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }));
}

/**
 * Generates sitemap entries for blog posts
//  */
// async function generateBlogPages(): Promise<SitemapEntry[]> {
//   return [];
// }

/**
 * Generates sitemap entries for blog category pages
//  */
// async function generateBlogCategoryPages(): Promise<SitemapEntry[]> {
//   return [];
// }

/**
 * Generates sitemap entries for blog tag pages
 */
// async function generateBlogTagPages(): Promise<SitemapEntry[]> {
//   return [];
// }

/**
 * Main sitemap generation function
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Generate all sitemap entries concurrently
    // const [blogPages, categoryPages, tagPages] = await Promise.all([
    //   generateBlogPages(),
    //   generateBlogCategoryPages(),
    //   generateBlogTagPages(),
    // ]);

    // Combine all entries
    const allEntries: SitemapEntry[] = [
      ...generateStaticPages(),
      ...generateCoursePages(),
      // ...blogPages,
      // ...categoryPages,
      // ...tagPages,
    ];

    // Sort URLs alphabetically for consistency
    return allEntries.sort((a, b) => a.url.localeCompare(b.url));

  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap with essential pages if there's an error
    return generateStaticPages();
  }
}

// Type guard to ensure sitemap entry properties are valid
// function validateSitemapEntry(entry: SitemapEntry): boolean {
//   if (!entry.url) return false;
//   if (entry.priority && (entry.priority < 0 || entry.priority > 1)) return false;
//   if (entry.lastModified && isNaN(new Date(entry.lastModified).getTime())) return false;
//   return true;
// }