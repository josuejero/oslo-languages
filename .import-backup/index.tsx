// src/pages/blog/index.tsx
import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import BlogList from '@/components/blog/BlogList';
import BlogManager from '@/components/admin/BlogManager';
import BlogFilter from '@/components/blog/BlogFilter'; // Updated import
import { useBlog } from '@/utils/hooks/useBlog';
import { Alert, AlertDescription } from '@/components/ui'; // Updated import
import LoadingSpinner from '@/components/common/LoadingSpinner'; // Updated import
import { logger } from '@/utils/logger';

const POSTS_PER_PAGE = 9;

interface BlogPageProps {
  initialPosts: any[];
  initialCategories: any[];
  initialTags: any[];
  initialTotal: number;
}

export const metadata = {
  title: 'Blog | Oslo Languages',
  description: 'Read our latest articles about language learning, Norwegian culture, and more.',
};

/**
 * BlogPage component renders the main blog page.
 *
 * It fetches initial data from the server and applies filters based on URL search parameters.
 *
 * @param {BlogPageProps} props - Initial data for posts, categories, tags, and total posts count.
 * @returns {JSX.Element} The rendered blog page.
 */
export default function BlogPage({
  initialPosts,
  initialCategories,
  initialTags,
  initialTotal
}: BlogPageProps): JSX.Element {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { searchPosts, loading, error } = useBlog();
  
  const [posts, setPosts] = useState(initialPosts);
  const [totalPosts, setTotalPosts] = useState(initialTotal);
  
  // Use optional chaining to safely get search parameters
  const currentPage = Number(searchParams?.get('page')) || 1;
  const currentCategory = searchParams?.get('category') || '';
  const currentTag = searchParams?.get('tag') || '';
  const currentQuery = searchParams?.get('q') || '';

  useEffect(() => {
    const fetchPosts = async () => {
      const result = await searchPosts({
        query: currentQuery,
        category: currentCategory,
        tag: currentTag,
        page: currentPage,
        limit: POSTS_PER_PAGE
      });

      if (result) {
        setPosts(result.posts);
        setTotalPosts(result.total);
      }
    };

    fetchPosts();
  }, [currentPage, currentCategory, currentTag, currentQuery, searchPosts]);

  // Handle filter changes
  const handleFilterChange = (filters: any) => {
    // Construct query string based on filters
    const params = new URLSearchParams();
    if (filters.search) params.set('q', filters.search);
    if (filters.category) params.set('category', filters.category);
    if (filters.tag) params.set('tag', filters.tag);
    
    router.push(`/blog?${params.toString()}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog</h1>
        
        {/* Use BlogFilter with proper props */}
        <BlogFilter
          categories={initialCategories || []}
          tags={initialTags || []}
          initialFilters={{
            search: currentQuery,
            category: currentCategory,
            tag: currentTag
          }}
          compact={true}
          onFilter={handleFilterChange}
          className="w-64"
        />
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="grid grid-cols-12 gap-8">
        <main className="col-span-12">
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner />
            </div>
          ) : (
            // Render the unified blog manager component to handle search, filtering, and pagination
            <BlogManager posts={posts} />
          )}
        </main>
      </div>
    </div>
  );
}

/**
 * Fetches the initial blog data from the server.
 *
 * @param {object} context - Context containing query parameters.
 * @returns {Promise<{props: BlogPageProps}>} The initial props for the blog page.
 */
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  try {
    // Fetch initial data concurrently
    const [postsData, categories, tags] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/search?${new URLSearchParams(query as Record<string, string>)}`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/categories`),
      fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/blog/tags`)
    ]);

    const [postsResult, categoriesData, tagsData] = await Promise.all([
      postsData.json(),
      categories.json(),
      tags.json()
    ]);

    return {
      props: {
        initialPosts: postsResult.posts,
        initialCategories: categoriesData,
        initialTags: tagsData,
        initialTotal: postsResult.total
      }
    };
  } catch (error) {
    // Log the error using the imported logger
    logger.error('Failed to fetch initial blog data:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return {
      props: {
        initialPosts: [],
        initialCategories: [],
        initialTags: [],
        initialTotal: 0
      }
    };
  }
};
