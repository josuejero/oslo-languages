// src/components/seo/BlogSEO.tsx
import Head from 'next/head';
// Use the usePathname hook from next/navigation to get the current path
import { usePathname } from 'next/navigation';
import { BlogPost } from '@/utils/blog';

interface BlogSEOProps {
  post: BlogPost;
  canonicalUrl?: string;
}

/**
 * BlogSEO component generates SEO meta tags for blog posts.
 *
 * @param {BlogSEOProps} props - The props for the component.
 * @returns {JSX.Element} The Head component with meta tags.
 */
export default function BlogSEO({ post, canonicalUrl }: BlogSEOProps) {
  const pathname = usePathname(); // Get current pathname using the new hook
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  // Construct URLs using pathname instead of the unsupported router.pathname
  const postUrl = canonicalUrl || `${baseUrl}${pathname}`;
  const imageUrl = post.coverImage ? `${baseUrl}${post.coverImage}` : undefined;

  // Format dates for schema
  const publishDate = post.publishedAt || post.updatedAt;
  const modifiedDate = post.updatedAt || post.publishedAt;

  // Article schema for structured data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: imageUrl,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Oslo Languages',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`
      }
    },
    datePublished: publishDate,
    dateModified: modifiedDate,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl
    },
    keywords: [...post.categories, ...post.tags].join(', ')
  };

  return (
    <Head>
      <title>{`${post.title} | Oslo Languages Blog`}</title>
      <meta name="description" content={post.excerpt} />
      
      {/* Open Graph meta tags */}
      <meta property="og:title" content={post.title} />
      <meta property="og:description" content={post.excerpt} />
      <meta property="og:type" content="article" />
      <meta property="og:url" content={postUrl} />
      {imageUrl && <meta property="og:image" content={imageUrl} />}
      
      {/* Twitter meta tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={post.title} />
      <meta name="twitter:description" content={post.excerpt} />
      {imageUrl && <meta name="twitter:image" content={imageUrl} />}
      
      {/* Article meta */}
      <meta property="article:published_time" content={publishDate} />
      {modifiedDate && (
        <meta property="article:modified_time" content={modifiedDate} />
      )}
      {post.categories.map((category: string) => (
        <meta key={category} property="article:section" content={category} />
      ))}
      {post.tags.map((tag: string) => (
        <meta key={tag} property="article:tag" content={tag} />
      ))}
      
      {/* Canonical URL */}
      <link rel="canonical" href={postUrl} />

      {/* Structured data using JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
    </Head>
  );
}
