// src/components/blog/BlogSearch.tsx
import React, { useEffect } from 'react';
import { Search } from 'lucide-react';

/**
 * Props for the BlogSearch component.
 * @property {string} search - The current search query.
 * @property {string} category - The selected category filter.
 * @property {string} tag - The selected tag filter.
 * @property {string} sortBy - The sort criteria (format: "field-order", e.g., "date-desc").
 * @property {(value: string) => void} onSearchChange - Callback fired when the search input changes.
 * @property {(value: string) => void} onCategoryChange - Callback fired when the category filter changes.
 * @property {(value: string) => void} onTagChange - Callback fired when the tag filter changes.
 * @property {(value: string) => void} onSortChange - Callback fired when the sort criteria changes.
 * @property {string} [className] - Additional CSS classes.
 */
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
}

/**
 * BlogSearch component provides a search input for blog posts.
 *
 * This is a controlled component where the search query, category, tag, and sort criteria
 * are passed as props along with corresponding callback functions.
 *
 * @param {BlogSearchProps} props - The props for the component.
 * @returns {JSX.Element} The rendered search component.
 */
export default function BlogSearch({
  search,
  category, // currently not rendered as a UI element but available for future use
  tag,      // currently not rendered as a UI element but available for future use
  sortBy,   // currently not rendered as a UI element but available for future use
  onSearchChange,
  onCategoryChange, // placeholder callback (can be hooked to additional UI controls)
  onTagChange,      // placeholder callback (can be hooked to additional UI controls)
  onSortChange,     // placeholder callback (can be hooked to additional UI controls)
  className = ''
}: BlogSearchProps): JSX.Element {
  // useEffect can be used for debouncing or side effects if needed in the future.
  useEffect(() => {
    // Currently no side effects are necessary.
  }, [search, category, tag, sortBy]);

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
      </div>
      
      <input
        type="search"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)} // update parent state on change
        placeholder="Search blog posts..."
        className="
          block w-full pl-10 pr-3 py-2
          border border-gray-300 rounded-md
          bg-white text-sm placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
        "
        aria-label="Search blog posts"
      />
    </div>
  );
}
