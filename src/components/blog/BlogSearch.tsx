// src/components/blog/BlogSearch.tsx
import React from 'react';

interface BlogSearchProps {
  search: string;
  category: string;
  tag: string;
  sortBy: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onSortChange: (sort: string) => void;
}

const CATEGORIES = [
  'Norwegian Language',
  'English Language',
  'Spanish Language',
  'Learning Tips',
  'Student Stories',
  'Oslo Life'
];

const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'title-asc', label: 'Title A-Z' },
  { value: 'title-desc', label: 'Title Z-A' }
];

export default function BlogSearch({
  search,
  category,
  tag,
  sortBy,
  onSearchChange,
  onCategoryChange,
  onTagChange,
  onSortChange
}: BlogSearchProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
      {/* Search Input */}
      <div>
        <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
          Search Posts
        </label>
        <input
          type="search"
          id="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title, content, or author..."
          className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Tag Filter */}
        <div>
          <label htmlFor="tag" className="block text-sm font-medium text-gray-700 mb-1">
            Tag
          </label>
          <input
            type="text"
            id="tag"
            value={tag}
            onChange={(e) => onTagChange(e.target.value)}
            placeholder="Filter by tag..."
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Sort Options */}
        <div>
          <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
            Sort By
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Filters */}
      {(category || tag || search) && (
        <div className="flex items-center gap-2 pt-2">
          <span className="text-sm text-gray-500">Active filters:</span>
          <div className="flex flex-wrap gap-2">
            {category && (
              <button
                onClick={() => onCategoryChange('')}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                {category}
                <span className="ml-1" aria-hidden="true">&times;</span>
              </button>
            )}
            {tag && (
              <button
                onClick={() => onTagChange('')}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                #{tag}
                <span className="ml-1" aria-hidden="true">&times;</span>
              </button>
            )}
            {search && (
              <button
                onClick={() => onSearchChange('')}
                className="inline-flex items-center px-2 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
              >
                &quot;{search}&quot;
                <span className="ml-1" aria-hidden="true">&times;</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}