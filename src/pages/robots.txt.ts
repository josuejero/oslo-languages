// src/pages/robots.txt.ts
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oslolanguages.com';
  
  // Unified robots.txt content with structured groups and comments
  const robotsTxt = `# robots.txt for Oslo Languages website
# Last updated: ${new Date().toISOString().split('T')[0]}

# Allow all user agents
User-agent: *
# Main pages and sections
Allow: /
Allow: /about
Allow: /courses
Allow: /blog
Allow: /contact
Allow: /faq

# Disallow administrative and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /private/
Disallow: /preview/
Disallow: /draft/
Disallow: /*?*
Disallow: /*.json$
Disallow: /*.php$
Disallow: /wp-*
Disallow: /*/feed/
Disallow: */trackback/
Disallow: /cdn-cgi/
Disallow: /.git/
Disallow: /.env
Disallow: /node_modules/
Disallow: /error
Disallow: /_next/static/development/
Disallow: /assets/private/

# Rules for Googlebot
User-agent: Googlebot
Allow: /
Allow: /courses/
Allow: /blog/
Allow: /sitemap.xml
Disallow: /*.json$
Disallow: /api/
Disallow: /private/
Disallow: /admin/
Disallow: /draft/
Disallow: /preview/

# Rules for Googlebot-Image
User-agent: Googlebot-Image
Allow: /images/
Allow: /photos/
Allow: /assets/public/
Disallow: /assets/private/
Disallow: /placeholder/

# Rules for Bingbot
User-agent: bingbot
Allow: /
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: /*.json$
Crawl-delay: 1

# Rules for archive bots
User-agent: archive.org_bot
Allow: /
Disallow: /private/
Disallow: /api/
Disallow: /admin/
Disallow: /members/
Disallow: /account/
Crawl-delay: 3

# AI Crawlers
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

# Sitemap locations
Sitemap: ${baseUrl}/sitemap.xml
`;

  // Set appropriate headers
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.write(robotsTxt);
  res.end();

  return {
    props: {},
  };
};

// This component doesn't render anything
export default function Robots() {
  return null;
}