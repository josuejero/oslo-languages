// src/components/blog/BlogFilter.tsx
import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import debounce from 'lodash/debounce';

interface BlogFilterProps {
  categories: string[];
  tags: string[];
  onFilter: (filters: FilterState) => void;
}

interface FilterState {
  search: string;
  category: string;
  tag: string;
  status?: 'all' | 'published' | 'draft';
  sortBy: 'date' | 'title';
  sortOrder: 'asc' | 'desc';
}

export default function BlogFilter({ categories, tags, onFilter }: BlogFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    tag: searchParams.get('tag') || '',
    status: (searchParams.get('status') as FilterState['status']) || 'all',
    sortBy: (searchParams.get('sortBy') as FilterState['sortBy']) || 'date',
    sortOrder: (searchParams.get('sortOrder') as FilterState['sortOrder']) || 'desc'
  });

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((value: string) => {
      const newFilters = { ...filters, search: value };
      setFilters(newFilters);
      onFilter(newFilters);
      updateURL(newFilters);
    }, 300),
    [filters, onFilter]
  );

  // Update URL with current filters
  const updateURL = (newFilters: FilterState) => {
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    router.push(`?${params.toString()}`);
  };

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilter(newFilters);
    updateURL(newFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      {/* Search Input */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
          Search Posts
        </label>
        <input
          type="search"
          id="search"
          value={filters.search}
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search by title or content..."
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Category Filter */}
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <select
          id="category"
          value={filters.category}
          onChange={(e) => handleFilterChange('category', e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Tag Filter */}
      <div>
        <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-2">
          Tag
        </label>
        <select
          id="tag"
          value={filters.tag}
          onChange={(e) => handleFilterChange('tag', e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter (Admin only) */}
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <select
          id="status"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Sort Options */}
      <div className="space-y-4">
        <div>
          <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-2">
            Sort By
          </label>
          <select
            id="sortBy"
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>

        <div>
          <label htmlFor="sortOrder" className="block text-sm font-medium text-gray-700 mb-2">
            Sort Order
          </label>
          <select
            id="sortOrder"
            value={filters.sortOrder}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </select>
        </div>
      </div>

      {/* Reset Filters Button */}
      <button
        onClick={() => {
          const defaultFilters: FilterState = {
            search: '',
            category: '',
            tag: '',
            status: 'all',
            sortBy: 'date',
            sortOrder: 'desc'
          };
          setFilters(defaultFilters);
          onFilter(defaultFilters);
          updateURL(defaultFilters);
        }}
        className="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
      >
        Reset Filters
      </button>
    </div>
  );
}