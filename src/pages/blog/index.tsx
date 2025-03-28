// src/pages/blog/index.tsx
import React, { useState, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter, useSearchParams } from 'next/navigation';
import BlogList from '@/components/blog/BlogList';
// Updated import: BlogManager is now imported from the admin folder
import BlogManager from '@/components/admin/BlogManager';
import BlogSearch from '@/components/blog/BlogFilter'; // New component import
import { useBlog } from '@/utils/hooks/useBlog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/LoadingSpinner';
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Blog</h1>
        {/* Render BlogSearch with proper type annotations for callback parameters */}
        <BlogSearch
          search={currentQuery}
          category={currentCategory}
          tag={currentTag}
          sortBy="date-desc" // Default sort value; adjust as needed
          onSearchChange={(value: string) => router.push(`/blog?q=${value}`)}
          onCategoryChange={(value: string) => router.push(`/blog?category=${value}`)}
          onTagChange={(value: string) => router.push(`/blog?tag=${value}`)}
          onSortChange={(value: string) => router.push(`/blog?sortBy=${value}`)}
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
