// src/components/blog/BlogSearch.tsx
import { useCallback } from 'react';
import { useDebounce } from '@/utils/hooks/useDebounce';

interface BlogSearchProps {
  /** Current search query string */
  search: string;
  /** Currently selected category */
  category: string;
  /** Currently selected tag */
  tag: string;
  /** Currently selected sort option */
  sortBy: string;
  /** Callback fired when the search input changes */
  onSearchChange: (value: string) => void;
  /** Callback fired when the category selection changes */
  onCategoryChange: (value: string) => void;
  /** Callback fired when the tag selection changes */
  onTagChange: (value: string) => void;
  /** Callback fired when the sort option changes */
  onSortChange: (value: string) => void;
  className?: string;
  placeholder?: string;
}

/**
 * BlogSearch component provides an input for text search and select menus for filtering.
 *
 * @param {BlogSearchProps} props - Props containing current values and change callbacks.
 * @returns {JSX.Element} The rendered search and filter controls.
 */
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
  // Debounce the search callback to improve performance on fast input changes.
  const debouncedSearch = useDebounce((value: string) => {
    onSearchChange(value);
  }, 300);

  const handleSearchInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debouncedSearch(e.target.value);
    },
    [debouncedSearch]
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="relative">
        <input
          type="search"
          onChange={handleSearchInput}
          value={search}
          placeholder={placeholder}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          aria-label="Search blog posts"
        />
      </div>
      {/* Category select */}
      <select
        onChange={(e) => onCategoryChange(e.target.value)}
        value={category}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        aria-label="Filter by category"
      >
        <option value="">All Categories</option>
        {/* In a real scenario, you might map over available categories */}
        <option value="tech">Tech</option>
        <option value="lifestyle">Lifestyle</option>
      </select>
      {/* Tag select */}
      <select
        onChange={(e) => onTagChange(e.target.value)}
        value={tag}
        className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        aria-label="Filter by tag"
      >
        <option value="">All Tags</option>
        {/* In a real scenario, you might map over available tags */}
        <option value="react">React</option>
        <option value="javascript">JavaScript</option>
      </select>
      {/* Sort select */}
      <select
        onChange={(e) => onSortChange(e.target.value)}
        value={sortBy}
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
