// src/components/blog/BlogSearch.tsx
import { useCallback, useEffect, useState } from 'react';
import { useDebounce } from '@/utils/hooks/useDebounce';

interface BlogSearchProps {
  search: string;
  category: string;
  tag: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onSortChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

export default function BlogSearch({
  search,
  category,
  tag,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onSortChange,
  className = '',
  placeholder = 'Search posts...',
}: BlogSearchProps) {
  const [searchValue, setSearchValue] = useState(search);

  // Debounce the search value changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue, onSearchChange]);

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchValue(e.target.value);
    },
    []
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <input
          type="search"
          value={searchValue}
          onChange={handleSearchInput}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          aria-label="Search blog posts"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        <option value="tech">Tech</option>
        <option value="lifestyle">Lifestyle</option>
      </select>

      <select
        value={tag}
        onChange={(e) => onTagChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        aria-label="Filter by tag"
      >
        <option value="">All Tags</option>
        <option value="react">React</option>
        <option value="javascript">JavaScript</option>
      </select>

      <select
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value)}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        aria-label="Sort posts by"
      >
        <option value="date-desc">Newest First</option>
        <option value="date-asc">Oldest First</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
      </select>
    </div>
  );
}