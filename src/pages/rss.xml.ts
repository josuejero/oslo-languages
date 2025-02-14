// src/pages/rss.xml.ts
import { GetServerSideProps } from 'next';
import { getAllPosts } from '@/utils/blog-operations';

/**
 * Server-side rendering function for generating the RSS feed.
 *
 * @param {object} context - The Next.js context containing the response object.
 * @returns {object} The props for the page (empty since the response is directly written).
 */
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const posts = await getAllPosts();
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

  // Generate the RSS feed with a fallback for undefined publishedAt/updatedAt dates
  const rss = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
      <channel>
        <title>Oslo Languages Blog</title>
        <link>${baseUrl}/blog</link>
        <description>Language learning insights, tips, and updates from Oslo Languages</description>
        <language>en</language>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
        
        ${posts.map(post => `
          <item>
            <title><![CDATA[${post.title}]]></title>
            <link>${baseUrl}/blog/${post.slug}</link>
            <guid isPermaLink="true">${baseUrl}/blog/${post.slug}</guid>
            <description><![CDATA[${post.excerpt}]]></description>
            <pubDate>${new Date(post.publishedAt || post.updatedAt || Date.now()).toUTCString()}</pubDate>
            ${post.categories.map(category => 
              `<category><![CDATA[${category}]]></category>`
            ).join('')}
          </item>
        `).join('')}
      </channel>
    </rss>`;

  // Set response headers for XML output
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, s-maxage=1200, stale-while-revalidate=600');
  res.write(rss);
  res.end();

  return {
    props: {},
  };
};

/**
 * RSS component (not rendered on the client).
 *
 * @returns {null} This component does not render anything.
 */
export default function RSS() {
  return null;
}
