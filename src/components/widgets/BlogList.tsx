// src/components/widgets/BlogList.tsx

import React from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { BlogPost } from '@/lib/blog';

interface BlogListProps {
  posts: BlogPost[];
  className?: string;
}

const BlogList = ({ posts, className = '' }: BlogListProps) => {
  return (
    <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {posts.map((post) => (
        <article key={post.slug} className="bg-bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
          {post.coverImage && (
            <div className="relative h-48">
              {/* CHANGED: Replaced Image with OptimizedImage */}
              <OptimizedImage
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                aspectRatio={16/9}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                lazyBoundary="200px"
                lowQualityPlaceholder={`${post.coverImage}?w=20`} // Optional: add low-quality placeholder
              />
            </div>
          )}
          
          <div className="p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.categories.map((category) => (
                <Link
                  key={category}
                  href={`/blog/category/${category.toLowerCase()}`}
                  className="text-sm bg-accent-primary text-white px-2 py-1 rounded-full hover:bg-accent-secondary transition-colors"
                >
                  {category}
                </Link>
              ))}
            </div>

            <h2 className="text-xl font-bold mb-2 text-text-primary">
              <Link href={`/blog/${post.slug}`} className="hover:text-accent-primary">
                {post.title}
              </Link>
            </h2>

            <p className="text-text-secondary mb-4">{post.excerpt}</p>

            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>{post.author}</span>
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString()}
              </time>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase()}`}
                  className="text-sm text-text-secondary hover:text-accent-primary"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default BlogList;