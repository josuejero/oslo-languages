// src/components/blog/BlogPost.tsx
import { useRef } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import OptimizedImage from '@/components/OptimizedImage';
import { BlogPost } from '@/utils/blog';
import ShareButtons from './ShareButtons';
import RichContent from './RichContent';
import TableOfContents from './TableOfContents';

interface Props {
  post: BlogPost;
  relatedPosts?: BlogPost[];
}

export default function BlogPostLayout({ post, relatedPosts }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <article
      className="max-w-4xl mx-auto px-4 py-8"
      aria-labelledby="blog-post-title"
    >
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
              aspectRatio={16/9}
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}

        {/* Categories */}
        <nav aria-label="Post categories" className="mb-4">
          <ul className="flex flex-wrap gap-2" role="list">
            {post.categories.map((category) => (
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

        <h1 id="blog-post-title" className="text-4xl font-bold mb-4">
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
          <span>{post.readingTime} min read</span>
        </div>

        {/* Share buttons */}
        <ShareButtons
          title={post.title}
          url={`/blog/${post.slug}`}
          description={post.excerpt}
        />
      </header>

      {/* Table of Contents */}
      <TableOfContents contentRef={contentRef as React.RefObject<HTMLDivElement>} />

      {/* Main Content */}
      <div
        ref={contentRef}
        id="post-content"
        className="prose prose-lg max-w-none"
        tabIndex={-1}
      >
        <RichContent content={post.content} />
      </div>

      {/* Tags */}
      <footer className="mt-12 pt-6 border-t border-gray-200">
        <nav aria-label="Post tags">
          <ul className="flex flex-wrap gap-2" role="list">
            {post.tags.map((tag) => (
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

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section
          aria-labelledby="related-posts-title"
          className="mt-12 pt-8 border-t border-gray-200"
        >
          <h2 id="related-posts-title" className="text-2xl font-bold mb-6">
            Related Posts
          </h2>
          {/* Add related posts component here */}
        </section>
      )}
    </article>
  );
}