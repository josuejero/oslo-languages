// src/modules/blog/operations.ts

import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import DOMPurify from 'isomorphic-dompurify';
import { remark } from 'remark';
import html from 'remark-html';
import { BlogPost, BlogFilterOptions } from './types';
import { logger } from '@/utils/logger';

// Ensure these directories use the correct path relative to project root
const CONTENT_DIR = path.join(process.cwd(), 'content');
const POSTS_DIR = path.join(CONTENT_DIR, 'posts');
const DRAFTS_DIR = path.join(CONTENT_DIR, 'drafts');
const BACKUP_DIR = path.join(CONTENT_DIR, 'backups');

// Log directory paths for debugging
console.log('Blog operations: Using directories', {
  CONTENT_DIR,
  POSTS_DIR,
  DRAFTS_DIR,
  BACKUP_DIR
});

/**
 * Custom error class for blog operations
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
 * Ensures that the necessary content directories exist
 */
async function ensureDirectories(): Promise<void> {
  try {
    console.log('Blog operations: Creating content directories');
    // Check and create content directory
    await fs.mkdir(CONTENT_DIR, { recursive: true });
    
    // Check and create posts directory
    await fs.mkdir(POSTS_DIR, { recursive: true });
    
    // Check and create drafts directory
    await fs.mkdir(DRAFTS_DIR, { recursive: true });
    
    // Check and create backups directory
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    console.log('Blog operations: Successfully created directories');
  } catch (error) {
    console.error('Blog operations: Failed to create directories', error);
    logger.error('Failed to create required directories', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new BlogError(
      'Failed to create required directories',
      'FILE_SYSTEM',
      500,
      error
    );
  }
}

/**
 * Creates a backup of a post before modifying it
 */
async function createBackup(slug: string): Promise<void> {
  try {
    const sourceFile = path.join(POSTS_DIR, `${slug}.md`);
    const backupFile = path.join(BACKUP_DIR, `${slug}_${Date.now()}.md`);
    
    // Check if source file exists before creating backup
    try {
      await fs.access(sourceFile);
      await fs.copyFile(sourceFile, backupFile);
      
      // Clean up old backups (keep last 5)
      const backups = await fs.readdir(BACKUP_DIR);
      const oldBackups = backups
        .filter(f => f.startsWith(slug))
        .sort()
        .slice(0, -5);
      
      await Promise.all(
        oldBackups.map(f => fs.unlink(path.join(BACKUP_DIR, f)))
      );
    } catch (error) {
      // Skip backup if file doesn't exist (like for new posts)
      if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
        return;
      }
      throw error;
    }
  } catch (error) {
    logger.warn('Failed to create backup', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      slug 
    });
    // We don't throw here as backup failure shouldn't stop the main operation
  }
}

/**
 * Calculates the estimated reading time for a given content
 */
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

/**
 * Creates a URL-friendly slug from a text
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

/**
 * Creates a new blog post
 */
export async function createPost(post: Partial<BlogPost>): Promise<BlogPost> {
  try {
    await ensureDirectories();

    if (!post.title) {
      throw new BlogError('Title is required', 'VALIDATION', 400);
    }

    const id = uuidv4();
    const slug = generateSlug(post.title);
    const now = new Date().toISOString();

    // Validate unique slug
    try {
      const postsFiles = await fs.readdir(POSTS_DIR);
      const draftsFiles = await fs.readdir(DRAFTS_DIR);
      const allFiles = [...postsFiles, ...draftsFiles];
      
      if (allFiles.includes(`${slug}.md`)) {
        throw new BlogError('Post with this title already exists', 'VALIDATION', 400);
      }
    } catch (error) {
      if (!(error instanceof BlogError)) {
        logger.error('Error checking existing posts', { 
          error: error instanceof Error ? error.message : 'Unknown error' 
        });
      } else {
        throw error;
      }
    }

    const newPost: BlogPost = {
      id,
      slug,
      title: post.title,
      content: DOMPurify.sanitize(post.content || ''),
      excerpt: post.excerpt || '',
      author: post.author || 'Anonymous',
      date: now,
      publishedAt: post.status === 'published' ? now : null,
      updatedAt: now,
      status: post.status || 'draft',
      categories: post.categories || [],
      tags: post.tags || [],
      coverImage: post.coverImage || undefined,
      readingTime: calculateReadingTime(post.content || ''),
      searchableContent: `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()
    };

    // Prepare the file content with front matter
    const fileContent = matter.stringify(newPost.content, {
      ...newPost,
      content: undefined, // Don't include content in front matter
    });

    // Determine target directory based on status
    const targetDir = post.status === 'published' ? POSTS_DIR : DRAFTS_DIR;
    const filePath = path.join(targetDir, `${slug}.md`);
    
    // Write the file
    await fs.writeFile(filePath, fileContent, 'utf8');

    logger.info('Post created successfully', { slug, id });
    return newPost;
  } catch (error) {
    if (error instanceof BlogError) throw error;
    
    logger.error('Failed to create post', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    throw new BlogError(
      'Failed to create post',
      'UNKNOWN',
      500,
      error
    );
  }
}

/**
 * Updates an existing blog post
 */
export async function updatePost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  try {
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      throw new BlogError('Post not found', 'NOT_FOUND', 404);
    }

    // Create backup before updating
    await createBackup(slug);

    // Process possible status change
    let targetDir = existingPost.status === 'published' ? POSTS_DIR : DRAFTS_DIR;
    let shouldMove = false;
    
    if (updates.status && updates.status !== existingPost.status) {
      targetDir = updates.status === 'published' ? POSTS_DIR : DRAFTS_DIR;
      shouldMove = true;
    }

    const updatedPost: BlogPost = {
      ...existingPost,
      ...updates,
      updatedAt: new Date().toISOString(),
      publishedAt: updates.status === 'published' 
        ? (existingPost.publishedAt || new Date().toISOString())
        : (existingPost.publishedAt || null),
      content: updates.content ? DOMPurify.sanitize(updates.content) : existingPost.content,
      readingTime: updates.content 
        ? calculateReadingTime(updates.content)
        : existingPost.readingTime,
      searchableContent: updates.content || updates.title || updates.excerpt
        ? `${updates.title || existingPost.title} ${updates.excerpt || existingPost.excerpt} ${updates.content || existingPost.content}`.toLowerCase()
        : existingPost.searchableContent
    };

    // Prepare file content
    const fileContent = matter.stringify(updatedPost.content, {
      ...updatedPost,
      content: undefined, // Don't include content in front matter
    });

    // Determine source and target file paths
    const sourceDir = existingPost.status === 'published' ? POSTS_DIR : DRAFTS_DIR;
    const sourceFile = path.join(sourceDir, `${slug}.md`);
    const targetFile = path.join(targetDir, `${slug}.md`);

    if (shouldMove) {
      // Write to new location and delete old file
      await fs.writeFile(targetFile, fileContent, 'utf8');
      await fs.unlink(sourceFile);
    } else {
      // Update existing file
      await fs.writeFile(sourceFile, fileContent, 'utf8');
    }

    logger.info('Post updated successfully', { slug });
    return updatedPost;
  } catch (error) {
    if (error instanceof BlogError) throw error;
    
    logger.error('Failed to update post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    });
    
    throw new BlogError(
      'Failed to update post',
      'UNKNOWN',
      500,
      error
    );
  }
}

/**
 * Deletes a blog post
 */
export async function deletePost(slug: string): Promise<void> {
  try {
    // Try to find post in published posts first
    let filePath = path.join(POSTS_DIR, `${slug}.md`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      // If not in published, try drafts
      filePath = path.join(DRAFTS_DIR, `${slug}.md`);
      try {
        await fs.access(filePath);
      } catch {
        throw new BlogError('Post not found', 'NOT_FOUND', 404);
      }
    }

    // Create backup before deleting
    await createBackup(slug);
    
    // Delete the file
    await fs.unlink(filePath);
    logger.info('Post deleted successfully', { slug });
  } catch (error) {
    if (error instanceof BlogError) throw error;
    
    logger.error('Failed to delete post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    });
    
    throw new BlogError(
      'Failed to delete post',
      'UNKNOWN',
      500,
      error
    );
  }
}

/**
 * Retrieves a blog post by its slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost> {
  try {
    // Try to find post in published posts first
    let filePath = path.join(POSTS_DIR, `${slug}.md`);
    let isPublished = true;
    
    // Check if file exists in published
    try {
      await fs.access(filePath);
    } catch {
      // If not in published, try drafts
      filePath = path.join(DRAFTS_DIR, `${slug}.md`);
      isPublished = false;
      
      try {
        await fs.access(filePath);
      } catch {
        throw new BlogError('Post not found', 'NOT_FOUND', 404);
      }
    }

    // Read and parse file
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    // Process Markdown to HTML
    const processedContent = await remark()
      .use(html)
      .process(content);
      
    const htmlContent = processedContent.toString();

    // Ensure correct status based on location
    const status = isPublished ? 'published' : 'draft';

    return {
      id: data.id || slug,
      slug,
      title: data.title,
      content: htmlContent,
      excerpt: data.excerpt || '',
      author: data.author || 'Anonymous',
      date: data.date,
      publishedAt: data.publishedAt || null,
      updatedAt: data.updatedAt || null,
      status: data.status || status,
      categories: Array.isArray(data.categories) ? data.categories : [],
      tags: Array.isArray(data.tags) ? data.tags : [],
      coverImage: data.coverImage || null,
      readingTime: data.readingTime || calculateReadingTime(content),
      searchableContent: `${data.title} ${data.excerpt} ${content}`.toLowerCase()
    };
  } catch (error) {
    if (error instanceof BlogError) throw error;
    
    logger.error('Failed to get post by slug', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    });
    
    throw new BlogError(
      'Failed to get post by slug',
      'NOT_FOUND',
      404,
      error
    );
  }
}

/**
 * Retrieves all blog posts
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    await ensureDirectories();
    
    // Get files from both posts and drafts directories
    const [publishedFiles, draftFiles] = await Promise.all([
      fs.readdir(POSTS_DIR),
      fs.readdir(DRAFTS_DIR)
    ]);

    // Filter markdown files
    const publishedSlugs = publishedFiles
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));
      
    const draftSlugs = draftFiles
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace(/\.md$/, ''));

    // Get all posts
    const publishedPosts = await Promise.all(
      publishedSlugs.map(slug => getPostBySlug(slug))
    );
    
    const draftPosts = await Promise.all(
      draftSlugs.map(slug => getPostBySlug(slug))
    );

    // Combine and sort by date (newest first)
    const allPosts = [...publishedPosts, ...draftPosts].sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.date).getTime();
      const dateB = new Date(b.publishedAt || b.date).getTime();
      return dateB - dateA;
    });

    return allPosts;
  } catch (error) {
    logger.error('Failed to get all posts', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    throw new BlogError(
      'Failed to get all posts',
      'UNKNOWN',
      500,
      error
    );
  }
}

/**
 * Retrieves posts by category
 */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllPosts();
    return allPosts.filter(post =>
      post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
    );
  } catch (error) {
    logger.error('Failed to get posts by category', {
      error: error instanceof Error ? error.message : 'Unknown error',
      category
    });
    
    throw new BlogError(
      'Failed to get posts by category',
      'UNKNOWN',
      500,
      error
    );
  }
}

/**
 * Retrieves posts by tag
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  try {
    const allPosts = await getAllPosts();
    return allPosts.filter(post =>
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  } catch (error) {
    logger.error('Failed to get posts by tag', {
      error: error instanceof Error ? error.message : 'Unknown error',
      tag
    });
    
    throw new BlogError(
      'Failed to get posts by tag',
      'UNKNOWN',
      500,
      error
    );
  }
}

/**
 * Creates an HTML preview from markdown content
 */
export async function previewContent(content: string): Promise<string> {
  try {
    const cleanContent = DOMPurify.sanitize(content);
    const processed = await remark()
      .use(html)
      .process(cleanContent);
    
    return processed.toString();
  } catch (error) {
    logger.error('Failed to generate preview', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    throw new BlogError(
      'Failed to generate preview',
      'PARSING',
      500,
      error
    );
  }
}

/**
 * Searches and filters blog posts
 */
export async function searchPosts(options: BlogFilterOptions): Promise<{ 
  posts: BlogPost[]; 
  total: number;
}> {
  try {
    const allPosts = await getAllPosts();
    let filtered = allPosts;

    // Apply filters
    if (options.query) {
      const query = options.query.toLowerCase();
      filtered = filtered.filter(post =>
        post.searchableContent?.includes(query) ||
        post.title.toLowerCase().includes(query) || 
        post.excerpt.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query)
      );
    }

    if (options.category) {
      filtered = filtered.filter(post =>
        post.categories.some(cat => 
          cat.toLowerCase() === options.category?.toLowerCase()
        )
      );
    }

    if (options.tag) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => 
          tag.toLowerCase() === options.tag?.toLowerCase()
        )
      );
    }

    if (options.status) {
      filtered = filtered.filter(post => post.status === options.status);
    }

    // Sort results
    const sortKey = options.sortBy || 'date';
    const sortOrder = options.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'date':
          comparison = new Date(b.publishedAt || b.date).getTime() -
                      new Date(a.publishedAt || a.date).getTime();
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

    // Pagination
    const page = options.page || 1;
    const limit = options.limit || 10;
    const start = (page - 1) * limit;
    const paginatedPosts = filtered.slice(start, start + limit);

    return {
      posts: paginatedPosts,
      total: filtered.length,
    };
  } catch (error) {
    logger.error('Failed to search posts', {
      error: error instanceof Error ? error.message : 'Unknown error',
      options
    });
    
    throw new BlogError(
      'Failed to search posts',
      'UNKNOWN',
      500,
      error
    );
  }
}

/**
 * Extracts categories and their counts from posts
 */
export function extractCategories(posts: BlogPost[]): Array<{ name: string; count: number; slug: string }> {
  const categoryCount = new Map<string, { name: string; count: number; slug: string }>();
  
  posts.forEach((post: any) => {
    post.categories.forEach((category: string) => {
      const slug = category.toLowerCase().replace(/\s+/g, '-');
      
      if (!categoryCount.has(slug)) {
        categoryCount.set(slug, { name: category, count: 0, slug });
      }
      
      const item = categoryCount.get(slug)!;
      item.count++;
    });
  });
  
  return Array.from(categoryCount.values())
    .sort((a, b) => b.count - a.count);
}

/**
 * Extracts tags and their counts from posts
 */
export function extractTags(posts: BlogPost[]): Array<{ name: string; count: number; slug: string }> {
  const tagCount = new Map<string, { name: string; count: number; slug: string }>();
  
  posts.forEach((post: any) => {
    post.tags.forEach((tag: string) => {
      const slug = tag.toLowerCase().replace(/\s+/g, '-');
      
      if (!tagCount.has(slug)) {
        tagCount.set(slug, { name: tag, count: 0, slug });
      }
      
      const item = tagCount.get(slug)!;
      item.count++;
    });
  });
  
  return Array.from(tagCount.values())
    .sort((a, b) => b.count - a.count);
}

/**
 * Generates a URL path for a blog post
 */
export function generatePostPath(slug: string): string {
  return `/blog/${slug}`;
}
