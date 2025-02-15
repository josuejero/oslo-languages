// src/utils/blog.ts
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import DOMPurify from 'isomorphic-dompurify';
import { remark } from 'remark';
import html from 'remark-html';
import { logger } from '@/utils/logger';
import { BlogPost, BlogFilterOptions } from '@/types/blog';

const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const DRAFTS_DIR = path.join(process.cwd(), 'content/drafts');

/**
 * Custom error class for blog-related errors.
 */
export class BlogError extends Error {
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
 * Ensures that the necessary directories exist.
 */
async function ensureDirectories() {
  console.debug('Ensuring directories exist:', { POSTS_DIR, DRAFTS_DIR });
  try {
    await fs.access(POSTS_DIR);
    console.debug('Accessed POSTS_DIR:', POSTS_DIR);
    await fs.access(DRAFTS_DIR);
    console.debug('Accessed DRAFTS_DIR:', DRAFTS_DIR);
  } catch (error) {
    console.error('Error accessing directories, attempting to create them:', error);
    await fs.mkdir(POSTS_DIR, { recursive: true });
    console.debug('Created POSTS_DIR:', POSTS_DIR);
    await fs.mkdir(DRAFTS_DIR, { recursive: true });
    console.debug('Created DRAFTS_DIR:', DRAFTS_DIR);
  }
}

/**
 * Logs and rethrows errors with additional context.
 *
 * @param error - The original error.
 * @param message - Additional context message.
 * @throws {BlogError}
 */
function handleBlogError(error: unknown, message: string): never {
  logger.error(message, {
    error: error instanceof Error ? error.message : 'Unknown error'
  });
  throw error instanceof BlogError ? error : new BlogError(message, 'UNKNOWN', 500, error);
}

/**
 * Saves a blog post to disk as a markdown file with YAML front matter.
 *
 * @param directory - Target directory (drafts or posts).
 * @param slug - The slug for the blog post.
 * @param post - The blog post data.
 * @returns {Promise<void>}
 */
async function savePost(directory: string, slug: string, post: BlogPost): Promise<void> {
  try {
    // Separate content from the rest of the post data.
    const { content, ...data } = post;
    // Generate markdown content with YAML front matter.
    const markdownContent = matter.stringify(content, data);
    const filePath = path.join(directory, `${slug}.md`);
    await fs.writeFile(filePath, markdownContent);
  } catch (error) {
    handleBlogError(error, 'Failed to save post');
  }
}

/**
 * Creates a new blog post and saves it to disk.
 *
 * @param data - Partial data for the blog post.
 * @returns The newly created blog post.
 */
export async function createPost(data: Partial<BlogPost>): Promise<BlogPost> {
  console.debug('Creating post with data:', data);
  try {
    await ensureDirectories();

    if (!data.title) {
      throw new BlogError('Title is required', 'VALIDATION', 400);
    }

    const id = uuidv4();
    const slug = createSlug(data.title);
    const now = new Date().toISOString();

    const newPost: BlogPost = {
      id,
      slug,
      title: data.title,
      content: DOMPurify.sanitize(data.content || ''),
      excerpt: data.excerpt || '',
      author: data.author || 'Anonymous',
      date: now,
      status: data.status || 'draft',
      categories: data.categories || [],
      tags: data.tags || [],
      coverImage: data.coverImage,
      readingTime: calculateReadingTime(data.content || '')
    };

    const targetDir = data.status === 'draft' ? DRAFTS_DIR : POSTS_DIR;
    console.debug(`Saving post ${slug} to directory ${targetDir}`);
    await savePost(targetDir, slug, newPost);

    logger.info('Post created:', { slug });
    return newPost;
  } catch (error) {
    handleBlogError(error, 'Failed to create post');
  }
}

// Constants
const WORDS_PER_MINUTE = 200;

/**
 * Filters posts based on provided criteria.
 *
 * @param posts - Array of blog posts.
 * @param filters - Filter options.
 * @returns Filtered blog posts.
 */
export function filterPosts(posts: BlogPost[], filters: BlogFilterOptions): BlogPost[] {
  return posts.filter(post => {
    if (filters.category && !post.categories.includes(filters.category)) {
      return false;
    }
    if (filters.tag && !post.tags.includes(filters.tag)) {
      return false;
    }
    if (filters.query) {
      const searchTerm = filters.query.toLowerCase();
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
 * Sorts posts by a given field.
 *
 * @param posts - Array of blog posts.
 * @param sortBy - Field to sort by.
 * @param sortOrder - 'asc' or 'desc'.
 * @returns Sorted array of posts.
 */
export function sortPosts(
  posts: BlogPost[],
  sortBy: 'date' | 'title' | 'author' = 'date',
  sortOrder: 'asc' | 'desc' = 'desc'
): BlogPost[] {
  return [...posts].sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case 'date':
        comparison = new Date(b.date).getTime() - new Date(a.date).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      case 'author':
        comparison = a.author.localeCompare(b.author);
        break;
    }
    return sortOrder === 'asc' ? -comparison : comparison;
  });
}

/**
 * Paginates the posts.
 *
 * @param posts - Array of blog posts.
 * @param page - Current page number.
 * @param limit - Number of items per page.
 * @returns An object containing paginated posts and total count.
 */
export function paginatePosts(
  posts: BlogPost[],
  page: number,
  limit: number
): { posts: BlogPost[]; total: number } {
  const start = (page - 1) * limit;
  return {
    posts: posts.slice(start, start + limit),
    total: posts.length,
  };
}

/**
 * Extracts categories and their counts from posts.
 *
 * @param posts - Array of blog posts.
 * @returns Array of category objects with name and count.
 */
export function extractCategories(posts: BlogPost[]): Array<{ name: string; count: number }> {
  const categoryCount = new Map<string, number>();
  posts.forEach(post => {
    post.categories.forEach(category => {
      categoryCount.set(category, (categoryCount.get(category) || 0) + 1);
    });
  });
  
  return Array.from(categoryCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Extracts tags and their counts from posts.
 *
 * @param posts - Array of blog posts.
 * @returns Array of tag objects with name and count.
 */
export function extractTags(posts: BlogPost[]): Array<{ name: string; count: number }> {
  const tagCount = new Map<string, number>();
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
    });
  });
  
  return Array.from(tagCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

/**
 * Calculates the estimated reading time for a given content.
 *
 * @param content - The text content.
 * @returns A string representing the reading time.
 */
export function calculateReadingTime(content: string): string {
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / WORDS_PER_MINUTE);
  return `${minutes} min read`;
}

/**
 * Formats a date string to a readable format.
 *
 * @param date - The date string.
 * @returns Formatted date.
 */
export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Creates a URL-friendly slug from a text.
 *
 * @param text - The input text.
 * @returns A slug string.
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
}

// Re-export functions from blog-operations to resolve TS2305 errors in tests.
export { 
  getPostBySlug, 
  getAllPosts, 
  getPostsByCategory, 
  getPostsByTag, 
  generatePostPath,
  // <<< NEW EXPORTS >>> Added updatePost, deletePost, searchPosts, and previewPost to fix TS2339 errors in API routes.
  updatePost,
  deletePost,
  searchPosts,
  previewPost
} from './blog-operations';

// Re-export types to ensure consistency.
export type { BlogPost, BlogFilterOptions };
