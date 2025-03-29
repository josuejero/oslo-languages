// src/components/blog/BlogList.tsx (Consolidated Version)
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBlog } from '@/utils/hooks/useBlog';
import BlogFilter from './BlogFilter';
import BlogPagination from './BlogPagination';
import { Alert, AlertDescription } from '@/components/ui';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import OptimizedImage from '@/components/OptimizedImage';
import type { BlogPost } from '@/modules/blog/types';

// Define prop types for the consolidated component
interface BlogListProps {
  // Basic props
  posts?: BlogPost[];
  className?: string;
  
  // Display mode props
  simple?: boolean;
  
  // Filter props
  showFilters?: boolean;
  initialFilters?: {
    search?: string;
    category?: string;
    tag?: string;
    sortBy?: 'date' | 'title';
    sortOrder?: 'asc' | 'desc';
  };
  onFilterChange?: (filters: any) => void;
  
  // Pagination props
  showPagination?: boolean;
  postsPerPage?: number;
}

/**
 * BlogList component - Displays a list of blog posts with optional filtering and pagination
 * 
 * @param props - Component properties
 * @returns Rendered component
 */
export default function BlogList({
  posts: initialPosts,
  className = '',
  simple = false,
  showFilters = true,
  initialFilters = {},
  onFilterChange,
  showPagination = true,
  postsPerPage = 10
}: BlogListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState(initialFilters);
  const { searchPosts, loading, error } = useBlog();
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts || []);
  const [totalPosts, setTotalPosts] = useState(initialPosts?.length || 0);

  // Skip API calls if posts are provided directly (simple mode)
  useEffect(() => {
    if (initialPosts) {
      setPosts(initialPosts);
      setTotalPosts(initialPosts.length);
      return;
    }

    // Only fetch posts if we're not in simple mode
    if (!simple) {
      fetchPosts();
    }
  }, [filters, currentPage, simple, initialPosts]);

  // Fetch posts from API
  const fetchPosts = async () => {
    const result = await searchPosts({
      query: filters.search,
      category: filters.category,
      tag: filters.tag,
      page: currentPage,
      limit: postsPerPage,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    });

    if (result) {
      setPosts(result.posts);
      setTotalPosts(result.total);
    }
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1); // Reset to first page when filters change
    
    // Call external handler if provided
    if (onFilterChange) {
      onFilterChange(updatedFilters);
    }
  };

  // Handle page changes
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show appropriate error state
  if (error && !simple) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // Simplified rendering for widget mode
  if (simple) {
    return (
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
        {renderPostGrid(posts)}
      </div>
    );
  }

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Filters - only show if enabled */}
      {showFilters && (
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <BlogFilter
              categories={[]} // You should pass actual categories here
              tags={[]} // You should pass actual tags here
              onFilter={(filters: any) => handleFilterChange(filters)}
            />
          </div>
          
          <div className="md:col-span-3">
            {loading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {renderPostGrid(posts)}
                </div>
                
                {posts.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No posts found matching your criteria.</p>
                  </div>
                )}
                
                {/* Pagination - only show if enabled and needed */}
                {showPagination && totalPosts > postsPerPage && (
                  <BlogPagination
                    currentPage={currentPage}
                    totalItems={totalPosts}
                    itemsPerPage={postsPerPage}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // Helper function to render the post grid
  function renderPostGrid(posts: BlogPost[]) {
    return posts.map((post) => (
      <article key={post.slug} className="bg-background-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
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
    ));
  }
}