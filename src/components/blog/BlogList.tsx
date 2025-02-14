// src/components/blog/BlogList.tsx

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { BlogPost, BlogFilter } from '@/types/blog';
import {
  filterPosts,
  sortPosts,
  paginatePosts,
  formatDate,
  PaginationOptions
} from '@/utils/blogUtils';

interface BlogListProps {
  posts: BlogPost[];
  initialFilter?: BlogFilter;
  pagination?: PaginationOptions;
  showFilters?: boolean;
  className?: string;
}

export default function BlogList({
  posts: initialPosts,
  initialFilter,
  pagination = { page: 1, limit: 9 },
  showFilters = true,
  className = ''
}: BlogListProps) {
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);
  const [currentFilter, setCurrentFilter] = useState<BlogFilter>(initialFilter || {});

  useEffect(() => {
    // Apply filters, sorting, and pagination
    let filteredPosts = filterPosts(initialPosts, currentFilter);
    filteredPosts = sortPosts(
      filteredPosts,
      currentFilter.sortBy,
      currentFilter.sortOrder
    );

    const { posts: paginatedPosts, total } = paginatePosts(filteredPosts, pagination);

    setDisplayedPosts(paginatedPosts);
    setTotalPosts(total);
  }, [initialPosts, currentFilter, pagination]);

  const handleFilterChange = (newFilter: Partial<BlogFilter>) => {
    setCurrentFilter(prev => ({ ...prev, ...newFilter }));
  };

  if (displayedPosts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-600">
          {currentFilter.query || currentFilter.category || currentFilter.tag
            ? "Try adjusting your search or filters"
            : "Check back later for new posts"}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Posts Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPosts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {post.coverImage && (
              <div className="relative h-48">
                <OptimizedImage
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                  aspectRatio={16/9}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  lazyBoundary="200px"
                />
              </div>
            )}
            
            <div className="p-6">
              {/* Categories */}
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleFilterChange({ category })}
                    className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                <Link
                  href={`/blog/${post.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h2>

              {/* Excerpt */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {post.excerpt}
              </p>

              {/* Metadata */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.author}</span>
                <time dateTime={post.date}>
                  {formatDate(post.date)}
                </time>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleFilterChange({ tag })}
                    className="text-sm text-gray-600 hover:text-blue-600"
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination - only show if we have more posts than the limit */}
      {totalPosts > pagination.limit && (
        <div className="flex justify-center space-x-2">
          <button
            onClick={() => 
              handleFilterChange({ 
                page: Math.max(1, (pagination.page || 1) - 1) 
              })
            }
            disabled={pagination.page === 1}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {pagination.page} of {Math.ceil(totalPosts / pagination.limit)}
          </span>
          
          <button
            onClick={() => 
              handleFilterChange({ 
                page: (pagination.page || 1) + 1 
              })
            }
            disabled={pagination.page >= Math.ceil(totalPosts / pagination.limit)}
            className="px-4 py-2 border rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}