// src/pages/blog-sitemap.xml.ts
import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/utils/blog';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const posts = await getAllPosts();

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${posts.map(post => `
        <url>
          <loc>${baseUrl}/blog/${post.slug}</loc>
          <lastmod>${post.updatedAt || post.publishedAt}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>
      `).join('')}
      
      <!-- Category pages -->
      ${Array.from(new Set(posts.flatMap(post => post.categories))).map(category => `
        <url>
          <loc>${baseUrl}/blog/category/${category.toLowerCase().replace(/\s+/g, '-')}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>
      `).join('')}
      
      <!-- Tag pages -->
      ${Array.from(new Set(posts.flatMap(post => post.tags))).map(tag => `
        <url>
          <loc>${baseUrl}/blog/tag/${tag.toLowerCase().replace(/\s+/g, '-')}</loc>
          <changefreq>weekly</changefreq>
          <priority>0.6</priority>
        </url>
      `).join('')}
    </urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=1800');
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
};

export default function BlogSitemap() {
  return null;
}