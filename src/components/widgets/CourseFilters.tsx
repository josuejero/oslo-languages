// src/components/widgets/CourseFilters.tsx
import { useId } from 'react';

interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface Props {
  languages: FilterOption[];
  levels: FilterOption[];
  schedules: FilterOption[];
  selectedFilters: {
    language?: string;
    level?: string;
    schedule?: string;
  };
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
}

export default function CourseFilters({
  languages,
  levels,
  schedules,
  selectedFilters,
  onFilterChange,
  onClearFilters,
}: Props) {
  const filterGroupId = useId();

  return (
    <div
      role="region"
      aria-labelledby="filter-heading"
      className="bg-white p-4 rounded-lg shadow-sm"
    >
      <h2 id="filter-heading" className="sr-only">
        Course filters
      </h2>

      <form className="space-y-6">
        {/* Language Filter */}
        <fieldset>
          <legend className="text-lg font-medium text-gray-900">Language</legend>
          <div className="mt-2 space-y-2">
            {languages.map(({ value, label, count }) => (
              <div key={value} className="flex items-center">
                <input
                  id={`${filterGroupId}-language-${value}`}
                  name="language"
                  value={value}
                  type="radio"
                  checked={selectedFilters.language === value}
                  onChange={(e) => onFilterChange('language', e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-describedby={count ? `${filterGroupId}-language-${value}-count` : undefined}
                />
                <label
                  htmlFor={`${filterGroupId}-language-${value}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {label}
                  {count !== undefined && (
                    <span
                      id={`${filterGroupId}-language-${value}-count`}
                      className="ml-2 text-gray-500"
                    >
                      ({count})
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Level Filter */}
        <fieldset>
          <legend className="text-lg font-medium text-gray-900">Level</legend>
          <div className="mt-2 space-y-2">
            {levels.map(({ value, label, count }) => (
              <div key={value} className="flex items-center">
                <input
                  id={`${filterGroupId}-level-${value}`}
                  name="level"
                  value={value}
                  type="radio"
                  checked={selectedFilters.level === value}
                  onChange={(e) => onFilterChange('level', e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-describedby={count ? `${filterGroupId}-level-${value}-count` : undefined}
                />
                <label
                  htmlFor={`${filterGroupId}-level-${value}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {label}
                  {count !== undefined && (
                    <span
                      id={`${filterGroupId}-level-${value}-count`}
                      className="ml-2 text-gray-500"
                    >
                      ({count})
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Schedule Filter */}
        <fieldset>
          <legend className="text-lg font-medium text-gray-900">Schedule</legend>
          <div className="mt-2 space-y-2">
            {schedules.map(({ value, label, count }) => (
              <div key={value} className="flex items-center">
                <input
                  id={`${filterGroupId}-schedule-${value}`}
                  name="schedule"
                  value={value}
                  type="radio"
                  checked={selectedFilters.schedule === value}
                  onChange={(e) => onFilterChange('schedule', e.target.value)}
                  className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                  aria-describedby={count ? `${filterGroupId}-schedule-${value}-count` : undefined}
                />
                <label
                  htmlFor={`${filterGroupId}-schedule-${value}`}
                  className="ml-3 text-sm text-gray-700"
                >
                  {label}
                  {count !== undefined && (
                    <span
                      id={`${filterGroupId}-schedule-${value}-count`}
                      className="ml-2 text-gray-500"
                    >
                      ({count})
                    </span>
                  )}
                </label>
              </div>
            ))}
          </div>
        </fieldset>

        {/* Clear Filters Button */}
        {Object.values(selectedFilters).some(Boolean) && (
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          >
            Clear all filters
          </button>
        )}
      </form>

      {/* Live Region for Filter Updates */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {Object.entries(selectedFilters)
          .filter(([, value]) => value)
          .map(([key, value]) => (
            `${key}: ${value}`
          )).join(', ') || 'No filters applied'}
      </div>
    </div>
  );
}