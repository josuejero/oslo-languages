// src/components/blog/BlogPost.tsx
import Link from 'next/link';
import Image from 'next/image';

interface BlogPostProps {
  post: {
    title: string;
    date: string;
    author: string;
    coverImage?: string;
    content: string;
    readingTime?: string;
    categories: string[];
    tags: string[];
  };
}

export default function BlogPost({ post }: BlogPostProps) {
  // Function to format date without date-fns
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      {/* Article Header */}
      <header className="mb-8">
        {post.coverImage && (
          <div className="relative h-[400px] mb-6 rounded-lg overflow-hidden">
            <Image
              src={post.coverImage}
              alt=""
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
        )}
        
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="mb-4">
            <ul className="flex flex-wrap gap-2">
              {post.categories.map((category: string) => (
                <li key={category}>
                  <Link
                    href={`/blog/category/${category.toLowerCase()}`}
                    className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full hover:bg-blue-200 transition-colors text-sm"
                  >
                    {category}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          {post.title}
        </h1>
        
        {/* Meta Information */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
          <span className="font-medium">{post.author}</span>
          <time dateTime={post.date}>
            {formatDate(post.date)}
          </time>
          {post.readingTime && (
            <>
              <span aria-hidden="true">•</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <div 
        className="prose prose-lg max-w-none mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      
      {/* Tags */}
      {post.tags.length > 0 && (
        <footer className="mt-12 pt-6 border-t border-gray-200">
          <h2 className="text-sm font-semibold uppercase text-gray-500 mb-4">Tags</h2>
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
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
        </footer>
      )}
    </article>
  );
}