/**
 * @file src/types/blog.ts
 * @description Re-exports blog types from the centralized module.
 * This file is maintained for backward compatibility during refactoring.
 * Eventually, all imports should point directly to the module.
 */

// Import all types from the new centralized module
import {
  BlogPost,
  BlogPostPreview,
  BlogFilterOptions,
  BlogFilter,
  BlogSearchResult
} from '@/modules/blog/types';

// Re-export all types to maintain backward compatibility
export type{
  BlogPost,
  BlogPostPreview,
  BlogFilterOptions,
  BlogFilter,
  BlogSearchResult
};

/**
 * @deprecated This file will be removed in a future version.
 * Please update your imports to use '@/modules/blog/types' directly.
 */