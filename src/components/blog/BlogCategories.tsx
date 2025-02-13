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
  className?: string;
}

export default function BlogCategories({ 
  categories,
  activeCategory,
  className = ''
}: BlogCategoriesProps) {
  return (
    <nav 
      className={`space-y-4 ${className}`}
      aria-label="Blog categories"
    >
      <h2 className="text-xl font-semibold text-gray-900">Categories</h2>
      <ul className="space-y-2">
        {categories.map((category) => (
          <li key={category.slug}>
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
          </li>
        ))}
      </ul>
    </nav>
  );
}