import React from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/utils/hooks/useDebounce';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface CourseFilterProps {
  languages: FilterOption[];
  levels: FilterOption[];
  schedules: FilterOption[];
  search: string;
  onSearchChange: (value: string) => void;
  selectedFilters: {
    language?: string;
    level?: string;
    schedule?: string;
  };
  onFilterChange: (type: 'language' | 'level' | 'schedule', value: string) => void;
  onClearFilters: () => void;
}

export default function CourseFilter({
  languages,
  levels,
  schedules,
  search,
  onSearchChange,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}: CourseFilterProps) {
  const [searchValue, setSearchValue] = React.useState(search);
  const debouncedSearch = useDebounce(searchValue, 300);

  React.useEffect(() => {
    onSearchChange(debouncedSearch);
  }, [debouncedSearch, onSearchChange]);

  const hasActiveFilters = Object.values(selectedFilters).some(Boolean) || searchValue;

  return (
    <div className="space-y-6">
      {/* Search Input */}
      <div className="relative">
        <input
          type="search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search courses..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
      </div>

      {/* Filter Groups */}
      <div className="space-y-4">
        {/* Language Filter */}
        <div>
          <h3 className="font-medium mb-2">Language</h3>
          <div className="space-y-2">
            {languages.map(({ value, label, count }) => (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="language"
                  value={value}
                  checked={selectedFilters.language === value}
                  onChange={() => onFilterChange('language', value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{label}</span>
                {count !== undefined && (
                  <span className="text-sm text-gray-500">({count})</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Level Filter */}
        <div>
          <h3 className="font-medium mb-2">Level</h3>
          <div className="space-y-2">
            {levels.map(({ value, label, count }) => (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="level"
                  value={value}
                  checked={selectedFilters.level === value}
                  onChange={() => onFilterChange('level', value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{label}</span>
                {count !== undefined && (
                  <span className="text-sm text-gray-500">({count})</span>
                )}
              </label>
            ))}
          </div>
        </div>

        {/* Schedule Filter */}
        <div>
          <h3 className="font-medium mb-2">Schedule</h3>
          <div className="space-y-2">
            {schedules.map(({ value, label, count }) => (
              <label key={value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="schedule"
                  value={value}
                  checked={selectedFilters.schedule === value}
                  onChange={() => onFilterChange('schedule', value)}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span>{label}</span>
                {count !== undefined && (
                  <span className="text-sm text-gray-500">({count})</span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <button
          onClick={onClearFilters}
          className="w-full px-4 py-2 text-sm text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}