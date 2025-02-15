// src/components/blog/BlogCategories.tsx
import Link from 'next/link';

interface Category {
  name: string;
  count: number;
  slug: string;
}

interface BlogCategoriesProps {
  categories: Category[];
  activeCategory?: string;
  onCategoryChange?: (category: string) => void;
  className?: string;
}

export default function BlogCategories({ 
  categories,
  activeCategory,
  onCategoryChange,
  className = ''
}: BlogCategoriesProps) {
  const handleCategoryClick = (category: string) => {
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <nav 
      className={`space-y-4 ${className}`}
      aria-label="Blog categories"
    >
      <h2 className="text-xl font-semibold text-text-primary">Categories</h2>
      <ul className="space-y-2" role="list">
        {categories.map((category) => (
          <li key={category.slug}>
            {onCategoryChange ? (
              <button
                onClick={() => handleCategoryClick(category.slug)}
                className={`
                  w-full flex justify-between items-center p-2 rounded-md
                  ${activeCategory === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                  }
                `}
                aria-current={activeCategory === category.slug ? 'true' : undefined}
              >
                <span>{category.name}</span>
                <span className={`
                  inline-flex items-center justify-center w-6 h-6 text-sm rounded-full
                  ${activeCategory === category.slug
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {category.count}
                </span>
              </button>
            ) : (
              <Link
                href={`/blog/category/${category.slug}`}
                className={`
                  flex justify-between items-center p-2 rounded-md
                  ${activeCategory === category.slug
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-blue-50'
                  }
                `}
                aria-current={activeCategory === category.slug ? 'page' : undefined}
              >
                <span>{category.name}</span>
                <span className={`
                  inline-flex items-center justify-center w-6 h-6 text-sm rounded-full
                  ${activeCategory === category.slug
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600'
                  }
                `}>
                  {category.count}
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}