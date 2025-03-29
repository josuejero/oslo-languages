// src/components/blog/BlogFilter.tsx (Consolidated Version)
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';

// Define types for filter options
interface Category {
  name: string;
  count: number;
  slug: string;
}

interface Tag {
  name: string;
  count: number;
  slug: string;
}

// Combined filter state including all possible options
export interface FilterState {
  search: string;
  category: string;
  tag: string;
  status?: 'all' | 'published' | 'draft';
  sortBy: 'date' | 'title' | 'author';
  sortOrder: 'asc' | 'desc';
}

interface BlogFilterProps {
  // Filter options data
  categories: Category[];
  tags: Tag[];
  
  // Display options
  compact?: boolean;
  showSearch?: boolean;
  showCategories?: boolean;
  showTags?: boolean;
  showSorting?: boolean;
  showStatus?: boolean;
  className?: string;
  placeholder?: string;
  
  // State and handlers
  initialFilters?: Partial<FilterState>;
  syncWithUrl?: boolean;
  onFilter: (filters: FilterState) => void;
}

/**
 * BlogFilter component - Provides filtering, search and sorting for blog posts
 * 
 * Two display modes:
 * 1. Compact: More streamlined for inline use (similar to former BlogSearch)
 * 2. Full: Complete filtering panel with all options (similar to former BlogFilter)
 * 
 * @param props - Component properties
 * @returns Rendered component
 */
export default function BlogFilter({
  categories = [],
  tags = [],
  compact = false,
  showSearch = true,
  showCategories = true,
  showTags = true,
  showSorting = true,
  showStatus = false,
  className = '',
  placeholder = 'Search posts...',
  initialFilters = {},
  syncWithUrl = false,
  onFilter
}: BlogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Initialize state from URL params or initial props
  const [filters, setFilters] = useState<FilterState>(() => {
    if (syncWithUrl) {
      return {
        search: searchParams?.get('search') ?? '',
        category: searchParams?.get('category') ?? '',
        tag: searchParams?.get('tag') ?? '',
        status: (searchParams?.get('status') as FilterState['status']) ?? 'all',
        sortBy: (searchParams?.get('sortBy') as FilterState['sortBy']) ?? 'date',
        sortOrder: (searchParams?.get('sortOrder') as FilterState['sortOrder']) ?? 'desc'
      };
    }
    
    // Use provided initial filters with defaults
    return {
      search: initialFilters.search ?? '',
      category: initialFilters.category ?? '',
      tag: initialFilters.tag ?? '',
      status: initialFilters.status ?? 'all',
      sortBy: initialFilters.sortBy ?? 'date',
      sortOrder: initialFilters.sortOrder ?? 'desc'
    };
  });

  // Set up debounced search
  const [searchValue, setSearchValue] = useState(filters.search);
  
  // Apply debounced search to filters when it changes
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFilterChange('search', searchValue);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchValue]);

  // Update URL when filters change (if syncWithUrl is enabled)
  const updateURL = useCallback((newFilters: FilterState) => {
    if (!syncWithUrl) return;
    
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value.toString());
    });
    
    router.push(`?${params.toString()}`);
  }, [router, syncWithUrl]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
    updateURL(newFilters);
  };

  // Reset all filters
  const resetFilters = () => {
    const defaultFilters: FilterState = {
      search: '',
      category: '',
      tag: '',
      status: 'all',
      sortBy: 'date',
      sortOrder: 'desc'
    };
    
    setFilters(defaultFilters);
    setSearchValue('');
    onFilter(defaultFilters);
    updateURL(defaultFilters);
  };

  // Determine if any filters are active
  const hasActiveFilters = filters.search || filters.category || filters.tag || 
    (filters.status && filters.status !== 'all') || 
    (filters.sortBy && filters.sortBy !== 'date') || 
    (filters.sortOrder && filters.sortOrder !== 'desc');

  // Compact version (like the former BlogSearch)
  if (compact) {
    return (
      <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
        {/* Search input */}
        {showSearch && (
          <div className="relative flex-grow">
            <input
              type="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"
              aria-label="Search blog posts"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        )}

        {/* Category select */}
        {showCategories && (
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        )}

        {/* Sort select */}
        {showSorting && (
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [FilterState['sortBy'], FilterState['sortOrder']];
              handleFilterChange('sortBy', sortBy);
              handleFilterChange('sortOrder', sortOrder);
            }}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            aria-label="Sort posts by"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="author-asc">Author A-Z</option>
            <option value="author-desc">Author Z-A</option>
          </select>
        )}
      </div>
    );
  }

  // Full version (like the former BlogFilter)
  return (
    <div className={`bg-white rounded-lg shadow p-6 space-y-6 ${className}`}>
      {/* Search Input */}
      {showSearch && (
        <div>
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Posts
          </label>
          <div className="relative">
            <input
              type="search"
              id="search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={placeholder}
              className="w-full px-4 py-2 pl-10 border rounded-md focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          </div>
        </div>
      )}

      {/* Category Filter */}
      {showCategories && (
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category.slug} value={category.slug}>
                {category.name} ({category.count})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Tag Filter */}
      {showTags && (
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
            Tag
          </label>
          <select
            id="tag"
            value={filters.tag}
            onChange={(e) => handleFilterChange('tag', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Tags</option>
            {tags.map((tag) => (
              <option key={tag.slug} value={tag.slug}>
                {tag.name} ({tag.count})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Status Filter (Admin only) */}
      {showStatus && (
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value as FilterState['status'])}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
      )}

      {/* Sort Options */}
      {showSorting && (
        <div className="space-y-4">
          <div>
            <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
              Sort By
            </label>
            <select
              id="sortBy"
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value as FilterState['sortBy'])}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="date">Date</option>
              <option value="title">Title</option>
              <option value="author">Author</option>
            </select>
          </div>

          <div>
            <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
              Sort Order
            </label>
            <select
              id="sortOrder"
              value={filters.sortOrder}
              onChange={(e) => handleFilterChange('sortOrder', e.target.value as FilterState['sortOrder'])}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Descending</option>
              <option value="asc">Ascending</option>
            </select>
          </div>
        </div>
      )}

      {/* Reset Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}