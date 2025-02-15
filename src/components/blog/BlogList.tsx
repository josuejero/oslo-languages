// src/components/blog/BlogList.tsx
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { formatDate } from '@/utils/blog';
import OptimizedImage from '@/components/OptimizedImage';

interface PaginationProps {
  page: number;
  limit: number;
}

interface BlogListProps {
  posts: BlogPost[];
  className?: string;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  // Added pagination prop to allow pagination controls as per tests
  pagination?: PaginationProps;
}

/**
 * Renders a grid of blog posts along with optional pagination controls.
 *
 * @param {BlogListProps} props - Component props including posts and optional pagination data.
 * @returns {JSX.Element} The rendered list of blog posts.
 */
export default function BlogList({
  posts,
  className = '',
  onCategoryClick,
  onTagClick,
  pagination,
}: BlogListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
        <p className="text-gray-600">Try adjusting your search or filters</p>
      </div>
    );
  }

  // Calculate pagination data if pagination prop is provided
  let totalPages = 1;
  if (pagination) {
    totalPages = Math.ceil(posts.length / pagination.limit);
  }

  return (
    <>
      <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {post.coverImage && (
              <div className="relative h-48">
                <OptimizedImage
                  src={post.coverImage}
                  alt=""
                  fill
                  className="object-cover"
                  aspectRatio={16 / 9}
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
                    onClick={() => onCategoryClick?.(category)}
                    className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full hover:bg-blue-200"
                  >
                    {category}
                  </button>
                ))}
              </div>
              <h2 className="text-xl font-bold mb-2 text-gray-900">
                <Link href={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{post.author}</span>
                <time dateTime={post.date}>{formatDate(post.date)}</time>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => onTagClick?.(tag)}
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

      {/* Render pagination controls if pagination prop is provided */}
      {pagination && (
        <div className="mt-8 flex items-center justify-center space-x-4">
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={pagination.page === 1}
            // In a real scenario, you would trigger a page change callback here.
          >
            Previous
          </button>
          <span>
            Page {pagination.page} of {totalPages}
          </span>
          <button
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
            disabled={pagination.page === totalPages}
            // In a real scenario, you would trigger a page change callback here.
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
