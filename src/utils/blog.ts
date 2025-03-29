// src/utils/blog.ts
/**
 * @file blog.ts
 * @description Compatibility layer that re-exports from the new blog module.
 * This file exists to maintain backward compatibility during refactoring.
 * Eventually, all imports should be updated to use the new module directly.
 */

// Re-export everything from the new module
export * from '@/modules/blog/operations';
export * from '@/modules/blog/types';
export * from '@/modules/blog/hooks';

// Import and re-export the BlogError class
import { BlogError } from '@/modules/blog/operations';
export { BlogError };

/**
 * @deprecated This file will be removed in a future version.
 * Please update your imports to use '@/modules/blog/operations' directly.
 */