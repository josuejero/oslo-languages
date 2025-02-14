// src/utils/blogUtils.ts

import { BlogPost, BlogFilterOptions, BlogFilter } from '@/types/blog';




export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Filters blog posts based on provided criteria
 * @param posts Array of blog posts to filter
 * @param filters Filtering criteria
 * @returns Filtered array of blog posts
 */
export function filterPosts(posts: BlogPost[], filters: BlogFilter): BlogPost[] {
  return posts.filter(post => {
    if (filters.category && !post.categories.includes(filters.category)) {
      return false;
    }
    if (filters.tag && !post.tags.includes(filters.tag)) {
      return false;
    }
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm)
      );
    }
    return true;
  });
}

/**
 * Sorts blog posts based on specified criteria
 * @param posts Array of blog posts to sort
 * @param sortBy Field to sort by
 * @param sortOrder Sort direction
 * @returns Sorted array of blog posts
 */
export function sortPosts(
  posts: BlogPost[],
  sortBy: 'date' | 'title' | 'author' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): BlogPost[] {
  return [...posts].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'date') {
      comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      comparison = a.title.localeCompare(b.title);
    }
    return sortOrder === 'asc' ? -comparison : comparison;
  });
}

/**
 * Paginates an array of blog posts
 * @param posts Array of blog posts to paginate
 * @param options Pagination options
 * @returns Object containing paginated posts and total count
 */
export function paginatePosts(
  posts: BlogPost[],
  { page, limit }: PaginationOptions
): { posts: BlogPost[]; total: number } {
  const start = (page - 1) * limit;
  const paginatedPosts = posts.slice(start, start + limit);
  return {
    posts: paginatedPosts,
    total: posts.length,
  };
}

/**
 * Calculates reading time for a blog post
 * @param content Post content
 * @returns Estimated reading time in minutes
 */
export function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Extracts all unique categories from blog posts
 * @param posts Array of blog posts
 * @returns Array of unique categories with counts
 */
export function extractCategories(posts: BlogPost[]): Array<{ name: string; count: number }> {
  const categoryCount = posts.reduce((acc, post) => {
    post.categories.forEach(category => {
      acc[category] = (acc[category] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(categoryCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extracts all unique tags from blog posts
 * @param posts Array of blog posts
 * @returns Array of unique tags with counts
 */
export function extractTags(posts: BlogPost[]): Array<{ name: string; count: number }> {
  const tagCount = posts.reduce((acc, post) => {
    post.tags.forEach(tag => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(tagCount)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Formats a date for display
 * @param date Date string
 * @returns Formatted date string
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Creates a URL-friendly slug from a string
 * @param text Text to convert to slug
 * @returns URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}