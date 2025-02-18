// src/components/blog/BlogList.tsx
import React, { useState, useEffect } from 'react';
import { useBlog } from '@/utils/hooks/useBlog';
import BlogFilter from './BlogFilter';
import BlogPagination from './BlogPagination';
import BlogPost from './BlogPost';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/LoadingSpinner';
import type { BlogPost as BlogPostType } from '@/types/blog';

const POSTS_PER_PAGE = 10;

// Define FilterState type to match BlogFilter component's expected props
interface FilterState {
  search: string;
  category: string;
  tag: string;
  sortBy: 'date' | 'title' | 'author';
  sortOrder: 'asc' | 'desc';
}

export default function BlogList() {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Initialize filters with proper types
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    tag: '',
    sortBy: 'date',
    sortOrder: 'desc'
  });

  const { searchPosts, loading, error } = useBlog();
  // Initialize posts state with proper type
  const [posts, setPosts] = useState<BlogPostType[]>([]);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await searchPosts({
        query: filters.search,
        category: filters.category,
        tag: filters.tag,
        page: currentPage,
        limit: POSTS_PER_PAGE,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      });

      if (result) {
        setPosts(result.posts);
        setTotalPosts(result.total);
      }
    };

    fetchPosts();
  }, [filters, currentPage, searchPosts]);

  // Add proper type for newFilters parameter
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-4 gap-8">
        <div className="md:col-span-1">
          <BlogFilter
            categories={[]} // You'll need to pass actual categories
            tags={[]} // You'll need to pass actual tags
            onFilter={handleFilterChange}
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
                {posts.map((post) => (
                  <BlogPost key={post.slug} post={post} />
                ))}
              </div>
              
              {posts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500">No posts found matching your criteria.</p>
                </div>
              )}
              
              {totalPosts > POSTS_PER_PAGE && (
                <BlogPagination
                  currentPage={currentPage}
                  totalItems={totalPosts}
                  itemsPerPage={POSTS_PER_PAGE}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}