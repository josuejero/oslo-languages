// src/pages/sitemap.xml.ts
import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/utils/blog';
import { logger } from '@/utils/logger';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oslolanguages.com';
    
    // Fetch blog posts
    const posts = await getAllPosts();

    // Static routes with metadata
    const staticRoutes = [
      { path: '/', changefreq: 'weekly', priority: '1.0' },
      { path: '/about', changefreq: 'monthly', priority: '0.8' },
      { path: '/courses', changefreq: 'weekly', priority: '0.9' },
      { path: '/contact', changefreq: 'monthly', priority: '0.8' },
      { path: '/blog', changefreq: 'daily', priority: '0.8' },
      { path: '/faq', changefreq: 'monthly', priority: '0.7' },
      { path: '/privacy-policy', changefreq: 'yearly', priority: '0.5' },
      { path: '/terms-of-service', changefreq: 'yearly', priority: '0.5' },
    ];

    // Course routes (dynamic)
    const courseRoutes = [
      'norwegian-beginner',
      'norwegian-intermediate',
      'business-english',
      'spanish-beginner',
    ].map(slug => ({
      path: `/courses/${slug}`,
      changefreq: 'monthly',
      priority: '0.8'
    }));

    // Category and tag data from posts
    const categories = new Set<string>();
    const tags = new Set<string>();
    
    posts.forEach(post => {
      post.categories.forEach(cat => categories.add(cat.toLowerCase().replace(/\s+/g, '-')));
      post.tags.forEach(tag => tags.add(tag.toLowerCase().replace(/\s+/g, '-')));
    });

    // Generate complete sitemap XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Static pages -->
  ${staticRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
  
  <!-- Course pages -->
  ${courseRoutes.map(route => `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('')}
  
  <!-- Blog posts -->
  ${posts.map(post => `
  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || post.publishedAt || post.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
  
  <!-- Category pages -->
  ${Array.from(categories).map(category => `
  <url>
    <loc>${baseUrl}/blog/category/${category}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
  
  <!-- Tag pages -->
  ${Array.from(tags).map(tag => `
  <url>
    <loc>${baseUrl}/blog/tag/${tag}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.6</priority>
  </url>`).join('')}
</urlset>`;

    // Set appropriate headers and return the XML
    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
    res.write(sitemap);
    res.end();

    return { props: {} };
  } catch (error) {
    // Log error but still return empty props
    logger.error('Failed to generate sitemap:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    res.statusCode = 500;
    res.end('Error generating sitemap');
    
    return { props: {} };
  }
};

// This component doesn't render anything on the client
export default function Sitemap() {
  return null;
}