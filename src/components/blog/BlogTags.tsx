// src/components/blog/BlogTags.tsx
import Link from 'next/link';

interface Tag {
  name: string;
  count: number;
  slug: string;
}

interface BlogTagsProps {
  tags: Tag[];
  activeTag?: string;
  className?: string;
  layout?: 'cloud' | 'list';
}

export default function BlogTags({ 
  tags,
  activeTag,
  className = '',
  layout = 'cloud'
}: BlogTagsProps) {
  // Sort tags by count for tag cloud
  const sortedTags = [...tags].sort((a, b) => b.count - a.count);
  
  // Calculate tag sizes based on count
  const getTagSize = (count: number) => {
    const max = Math.max(...tags.map(t => t.count));
    const min = Math.min(...tags.map(t => t.count));
    const range = max - min;
    const ratio = range > 0 ? (count - min) / range : 1;
    
    // Return tailwind text size class
    if (ratio > 0.8) return 'text-xl';
    if (ratio > 0.6) return 'text-lg';
    if (ratio > 0.4) return 'text-base';
    return 'text-sm';
  };

  return (
    <nav 
      className={`${className}`}
      aria-label="Blog tags"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Tags</h2>
      
      {layout === 'cloud' ? (
        <div className="flex flex-wrap gap-2">
          {sortedTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              className={`
                inline-flex items-center rounded-full px-3 py-1
                ${getTagSize(tag.count)}
                ${activeTag === tag.slug
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
              aria-current={activeTag === tag.slug ? 'page' : undefined}
            >
              {tag.name}
              <span className="ml-1 text-xs">
                ({tag.count})
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {sortedTags.map((tag) => (
            <li key={tag.slug}>
              <Link
                href={`/blog/tag/${tag.slug}`}
                className={`
                  flex justify-between items-center p-2 rounded-md
                  ${activeTag === tag.slug
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                  }
                `}
                aria-current={activeTag === tag.slug ? 'page' : undefined}
              >
                <span>{tag.name}</span>
                <span className={`
                  inline-flex items-center justify-center w-6 h-6 text-sm rounded-full
                  ${activeTag === tag.slug
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {tag.count}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </nav>
  );
}