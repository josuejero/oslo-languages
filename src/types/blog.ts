// src/types/blog.ts

/**
 * Represents a blog post
 */
export interface BlogPost {
  /** Unique identifier for the post */
  id: string;
  
  /** URL-friendly slug for the post */
  slug: string;
  
  /** Post title */
  title: string;
  
  /** Main content of the post (can be markdown or HTML) */
  content: string;
  
  /** Short description or preview of the post */
  excerpt: string;
  
  /** Author's name */
  author: string;
  
  /** Publication date */
  date: string;
  
  /** Optional update date */
  updatedAt?: string | null;
  
  /** Publication status */
  status?: 'draft' | 'published';
  
  /** Categories the post belongs to */
  categories: string[];
  
  /** Tags associated with the post */
  tags: string[];
  
  /** URL to the post's cover image */
  coverImage?: string;
  
  /** Estimated reading time (e.g., "5 min read") */
  readingTime?: string;

  publishedAt?: string;

  searchableContent?: string;
}

/**
 * Post metadata used for previews and listings
 */
export interface BlogPostPreview {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  categories: string[];
  tags: string[];
  coverImage?: string;
  readingTime?: string;
}

/**
 * Blog search and filter options
 */
export interface BlogFilterOptions {
  /** Search query text */
  query?: string; // Rename `search` to `query` for consistency
  /** Filter by category */
  category?: string;
  /** Filter by tag */
  tag?: string;
  /** Filter by status */
  status?: 'draft' | 'published';
  /** Sort field */
  sortBy?: 'date' | 'title' | 'author'; // Add 'author' to the allowed sort options
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
  /** Page number for pagination */
  page?: number;
  /** Items per page */
  limit?: number;
  search?: string; // Add this property

}

export type BlogFilter = BlogFilterOptions;


/**
 * Blog search results
 */
export interface BlogSearchResult {
  /** Array of posts matching the search criteria */
  posts: BlogPostPreview[];
  
  /** Total number of posts matching the criteria */
  total: number;
  
  /** Available categories with post counts */
  categories?: Array<{ name: string; count: number }>;
  
  /** Available tags with post counts */
  tags?: Array<{ name: string; count: number }>;
}