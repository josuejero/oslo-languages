// src/components/blog/BlogPost.tsx
import { useState, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { format } from 'date-fns';
import OptimizedImage from '@/components/OptimizedImage';
// Fixed import: now re-exports BlogPost type from '@/types/blog'
import { BlogPost } from '@/utils/blog';
import RichContent from './RichContent';
import TableOfContents from './TableOfContents';

interface Props {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

/**
 * BlogPostLayout renders a detailed view of a single blog post,
 * including meta tags, share buttons, table of contents, and content.
 *
 * @param {Props} props - Contains the post data and optionally related posts.
 * @returns {JSX.Element} The rendered blog post page.
 */
export default function BlogPostLayout({ post, relatedPosts }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Head>
        <title>{post.title}</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:image" content={post.coverImage} />
        <link
          rel="canonical"
          href={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`}
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": post.title,
            "description": post.excerpt,
            "image": post.coverImage,
            "author": { "@type": "Person", "name": post.author },
            "datePublished": post.date
          })}
        </script>
      </Head>
      <article className="max-w-4xl mx-auto px-4 py-8" aria-labelledby="blog-post-title">
        {/* Skip to main content link */}
        <a
          href="#post-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-600 p-2 z-50"
        >
          Skip to post content
        </a>
        {/* Article Header */}
        <header className="mb-8">
          {post.coverImage && (
            <div className="relative h-[400px] mb-6 rounded-lg overflow-hidden">
              <OptimizedImage
                src={post.coverImage}
                alt={post.coverImage || ''}
                fill
                className="object-cover"
                priority
                aspectRatio={16 / 9}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          {/* Categories – only render if available */}
          {post.categories.length > 0 && (
            <nav aria-label="Post categories" data-testid="categories" className="mb-4">
              <ul className="flex flex-wrap gap-2" role="list">
                {post.categories.map((category: string) => (
                  <li key={category}>
                    <Link
                      href={`/blog/category/${category.toLowerCase()}`}
                      className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
          <h1 id="blog-post-title" data-testid="blog-post-title" className="text-4xl font-bold mb-4">
            {post.title}
          </h1>
          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.author}</span>
            </div>
            <time dateTime={post.date}>
              {format(new Date(post.date), 'MMMM d, yyyy')}
            </time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime}</span>
          </div>
        </header>
        {/* Table of Contents */}
        <TableOfContents contentRef={contentRef} />
        {/* Main Content */}
        <div
          ref={contentRef}
          id="post-content"
          className="prose prose-lg max-w-none"
          tabIndex={-1}
        >
          <RichContent content={post.content} />
        </div>
        {/* Share Options Section added for accessibility */}
        <section
          role="region"
          aria-label="Share options"
          className="mt-4" // Added margin for spacing
        >
          <div className="flex space-x-4">
            {/* Dummy share buttons – can be enhanced later */}
            <button className="p-2 bg-blue-100 text-blue-800 rounded">
              Twitter
            </button>
            <button className="p-2 bg-blue-100 text-blue-800 rounded">
              LinkedIn
            </button>
            <button className="p-2 bg-blue-100 text-blue-800 rounded">
              Email
            </button>
          </div>
        </section>
        {/* Tags – only render if available */}
        {post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t border-gray-200">
            <nav aria-label="Post tags" data-testid="tags">
              <ul className="flex flex-wrap gap-2" role="list">
                {post.tags.map((tag: string) => (
                  <li key={tag}>
                    <Link
                      href={`/blog/tag/${tag.toLowerCase()}`}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </footer>
        )}
        {/* Related Posts */}
        {relatedPosts && relatedPosts.length > 0 && (
          <section
            aria-labelledby="related-posts-title"
            className="mt-12 pt-8 border-t border-gray-200"
          >
            <h2 id="related-posts-title" className="text-2xl font-bold mb-6">
              Related Posts
            </h2>
            {/* Related posts component can be added here */}
          </section>
        )}
      </article>
    </>
  );
}
