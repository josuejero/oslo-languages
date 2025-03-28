/**
 * @file src/modules/blog/types.ts
 * @description Consolidated type definitions for the blog module
 */

/**
 * Represents a blog post with all its properties
 */
export interface BlogPost {
  /** Unique identifier for the post */
  id: string;
  
  /** URL-friendly slug for the post */
  slug: string;
  
  /** Post title */
  title: string;
  
  /** Main content of the post (markdown or HTML) */
  content: string;
  
  /** Short description or preview of the post */
  excerpt: string;
  
  /** Author's name */
  author: string;
  
  /** ISO date string for post creation */
  date: string;
  
  /** ISO date string for when the post was last updated */
  updatedAt?: string | null;
  
  /** ISO date string for when the post was published */
  publishedAt?: string | null;
  
  /** Publication status */
  status: 'draft' | 'published';
  
  /** Categories the post belongs to */
  categories: string[];
  
  /** Tags associated with the post */
  tags: string[];
  
  /** URL to the post's cover image */
  coverImage?: string;
  
  /** Estimated reading time (e.g., "5 min read") */
  readingTime?: string;
  
  /** Lowercase, searchable content for filtering */
  searchableContent?: string;
}

/**
 * Represents post metadata used for previews and listings
 */
export interface BlogPostPreview {
  /** Unique identifier for the post */
  id: string;
  
  /** URL-friendly slug for the post */
  slug: string;
  
  /** Post title */
  title: string;
  
  /** Short description of the post */
  excerpt: string;
  
  /** Author's name */
  author: string;
  
  /** ISO date string for post creation */
  date: string;
  
  /** Categories the post belongs to */
  categories: string[];
  
  /** Tags associated with the post */
  tags: string[];
  
  /** URL to the post's cover image */
  coverImage?: string;
  
  /** Estimated reading time */
  readingTime?: string;
}

/**
 * Options for filtering and searching blog posts
 */
export interface BlogFilterOptions {
  /** Search query text */
  query?: string;
  
  /** Filter by category */
  category?: string;
  
  /** Filter by tag */
  tag?: string;
  
  /** Filter by publication status */
  status?: 'draft' | 'published';
  
  /** Field to sort by */
  sortBy?: 'date' | 'title' | 'author';
  
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  
  /** Page number for pagination (1-based) */
  page?: number;
  
  /** Items per page */
  limit?: number;
}

/**
 * BlogFilter interface defines the parameters used for filtering and searching blog posts.
 * This provides a standardized way to filter blog content across the application.
 */
export interface BlogFilter {
  /**
   * Text-based search query to filter posts by title, content, or excerpt
   */
  query?: string;
  
  /**
   * Filter posts by a specific category
   * Can be either a category slug or ID depending on implementation
   */
  category?: string;
  
  /**
   * Filter posts by a specific tag
   * Can be either a tag slug or ID depending on implementation
   */
  tag?: string;
  
  /**
   * Filter posts by their publication status
   */
  status?: 'draft' | 'published' | 'all';
  
  /**
   * Filter posts by author
   * Can be either an author name, slug, or ID depending on implementation
   */
  author?: string;
  
  /**
   * Start date for date range filtering (ISO string format)
   */
  dateFrom?: string;
  
  /**
   * End date for date range filtering (ISO string format)
   */
  dateTo?: string;
  
  /**
   * Field to sort results by
   */
  sortBy?: 'date' | 'title' | 'author' | 'popularity';
  
  /**
   * Sort direction
   */
  sortOrder?: 'asc' | 'desc';
  
  /**
   * Page number for pagination (1-based)
   */
  page?: number;
  
  /**
   * Number of items per page
   */
  limit?: number;
  
  /**
   * Additional custom filters that may be implementation-specific
   * This allows extending the filter functionality without changing the interface
   */
  [key: string]: unknown;
}

/**
 * Results from a blog search operation
 */
export interface BlogSearchResult {
  /** Posts matching the search criteria */
  posts: BlogPostPreview[];
  
  /** Total number of posts matching the criteria (for pagination) */
  total: number;
  
  /** Available categories with post counts */
  categories?: Array<{ name: string; count: number; slug: string }>;
  
  /** Available tags with post counts */
  tags?: Array<{ name: string; count: number; slug: string }>;
}

/**
 * Custom error class for blog-related errors
 */
export class BlogError extends Error {
  /**
   * Create a new BlogError
   * 
   * @param message - Error message
   * @param code - Error code
   * @param statusCode - HTTP status code
   * @param originalError - Original error that caused this one
   */
  constructor(
    message: string,
    public code: 'NOT_FOUND' | 'VALIDATION' | 'FILE_SYSTEM' | 'PARSING' | 'UNKNOWN',
    public statusCode: number = 500,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'BlogError';
  }
}

/**
 * Type for blog post creation
 */
export type CreateBlogInput = Omit<BlogPost, 'id' | 'slug' | 'date' | 'updatedAt' | 'publishedAt' | 'readingTime' | 'searchableContent'>;

/**
 * Type for blog post update
 */
export type UpdateBlogInput = Partial<CreateBlogInput>;