// src/components/blog/BlogList.tsx - Enhanced version
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBlog } from '@/lib/hooks/useBlog';
import { BlogPost } from '@/lib/blog/operations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import OptimizedImage from '@/components/OptimizedImage';
import BlogSearch from '@/components/blog/BlogSearch';
import { useDebounce } from '@/lib/hooks/useDebounce';

interface BlogListProps {
  initialPosts?: Partial<BlogPost>[];
  showFilters?: boolean;
}

export default function BlogList({ initialPosts, showFilters = true }: BlogListProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts as BlogPost[] || []);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { loading, error, searchPosts } = useBlog();
  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    if (!initialPosts) {
      fetchPosts();
    }
  }, [page, debouncedSearch, selectedCategory, selectedTag, sortBy, sortOrder]);

  const fetchPosts = async () => {
    const result = await searchPosts({
      query: debouncedSearch,
      category: selectedCategory,
      tag: selectedTag,
      sortBy,
      sortOrder,
      page,
      limit: 9
    });

    if (result) {
      setPosts(result.posts);
      setTotal(result.total);
    }
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const handleTagChange = (tag: string) => {
    setSelectedTag(tag);
    setPage(1);
  };

  const handleSortChange = (value: string) => {
    const [newSortBy, newSortOrder] = value.split('-') as ['date' | 'title', 'asc' | 'desc'];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setPage(1);
  };

  return (
    <div className="space-y-8">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {showFilters && (
        <BlogSearch
          search={search}
          category={selectedCategory}
          tag={selectedTag}
          sortBy={`${sortBy}-${sortOrder}`}
          onSearchChange={handleSearch}
          onCategoryChange={handleCategoryChange}
          onTagChange={handleTagChange}
          onSortChange={handleSortChange}
        />
      )}

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-96"
            />
          ))}
        </div>
      ) : posts.length > 0 ? (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
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
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => handleCategoryChange(category)}
                        className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{post.author}</span>
                    <time dateTime={post.publishedAt || post.updatedAt || ''}>
                      {new Date(post.publishedAt || post.updatedAt || '').toLocaleDateString()}
                    </time>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => handleTagChange(tag)}
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

          {total > 9 && (
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-4 py-2">
                Page {page} of {Math.ceil(total / 9)}
              </span>
              <button
                onClick={() => setPage(p => p + 1)}
                disabled={page >= Math.ceil(total / 9)}
                className="px-4 py-2 border rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">
            {search || selectedCategory || selectedTag
              ? "Try adjusting your search or filters"
              : "Check back later for new posts"}
          </p>
        </div>
      )}
    </div>
  );
}