// src/components/blog/BlogList.tsx
import { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/blog';
import BlogFilter from './BlogFilter';
import OptimizedImage from '@/components/OptimizedImage';

interface BlogListProps {
  initialPosts: BlogPost[];
  categories: string[];
  tags: string[];
}

export default function BlogList({ initialPosts, categories, tags }: BlogListProps) {
  const [posts] = useState<BlogPost[]>(initialPosts);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);

  // Handle filter changes
  const handleFilter = (filters: any) => {
    setIsLoading(true);

    // Apply filters
    let filtered = [...posts];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(post => 
        post.categories.includes(filters.category)
      );
    }

    // Tag filter
    if (filters.tag) {
      filtered = filtered.filter(post => 
        post.tags.includes(filters.tag)
      );
    }

    // Status filter (if applicable)
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(post => 'status' in post && (post as any).status === filters.status);    }

    // Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === 'date') {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        return filters.sortOrder === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }
    });

    setFilteredPosts(filtered);
    setIsLoading(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Filters Sidebar */}
      <aside className="lg:col-span-1">
        <BlogFilter
          categories={categories}
          tags={tags}
          onFilter={handleFilter}
        />
      </aside>

      {/* Posts Grid */}
      <div className="lg:col-span-3">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.slug} className="bg-white rounded-lg shadow-lg overflow-hidden">
                {post.coverImage && (
                  <div className="relative h-48">
                    <OptimizedImage
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      className="object-cover"
                      aspectRatio={16/9}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category) => (
                      <Link
                        key={category}
                        href={`/blog/category/${category.toLowerCase()}`}
                        className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full"
                      >
                        {category}
                      </Link>
                    ))}
                  </div>

                  <h2 className="text-xl font-bold mb-2">
                    <Link href={`/blog/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-gray-600 mb-4">{post.excerpt}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500">
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
                        className="text-sm text-gray-600 hover:text-blue-600"
                      >
                        #{tag}
                      </Link>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">No posts found</h3>
            <p className="mt-2 text-gray-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}