// src/lib/blog/operations.ts
import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import DOMPurify from 'isomorphic-dompurify';
import { remark } from 'remark';
import html from 'remark-html';
import { logger } from '@/utils/logger';
import { unified } from 'unified';
import remarkHtml from 'remark-html';
import type { BlogPost } from '@/types/blog';

const POSTS_DIRECTORY = path.join(process.cwd(), 'content', 'posts');
const POSTS_DIR = path.join(process.cwd(), 'content/posts');
const BACKUP_DIR = path.join(process.cwd(), 'content/backups');

// Enhanced error handling
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



interface SearchParams {
  query?: string;
  category?: string;
  tag?: string;
  status?: 'draft' | 'published';
  page?: number;
  limit?: number;
  sortBy?: 'date' | 'title' | 'author';
  sortOrder?: 'asc' | 'desc';
}


// Helper function to ensure directories exist

async function ensureDirectories() {
  console.debug('Ensuring directories exist in blog-operations:', { POSTS_DIR, BACKUP_DIR });
  try {
    await fs.access(POSTS_DIR);
    console.debug('Accessed POSTS_DIR in blog-operations:', POSTS_DIR);
    await fs.access(BACKUP_DIR);
    console.debug('Accessed BACKUP_DIR in blog-operations:', BACKUP_DIR);
  } catch (error) {
    console.error('Error accessing directories in blog-operations:', error);
    await fs.mkdir(POSTS_DIR, { recursive: true });
    console.debug('Created POSTS_DIR in blog-operations:', POSTS_DIR);
    await fs.mkdir(BACKUP_DIR, { recursive: true });
    console.debug('Created BACKUP_DIR in blog-operations:', BACKUP_DIR);
  }
}

// Helper function to create backup
async function createBackup(slug: string) {
  console.debug(`Creating backup for post: ${slug}`);
  try {
    const sourceFile = path.join(POSTS_DIR, `${slug}.md`);
    const backupFile = path.join(BACKUP_DIR, `${slug}_${Date.now()}.md`);
    await fs.copyFile(sourceFile, backupFile);
    console.debug(`Backup created: ${backupFile}`);
    
    const backups = await fs.readdir(BACKUP_DIR);
    console.debug('Existing backups:', backups);
    const oldBackups = backups
      .filter(f => f.startsWith(slug))
      .sort()
      .slice(0, -5);
    
    console.debug('Old backups to delete:', oldBackups);
    await Promise.all(
      oldBackups.map(f => {
        const deletePath = path.join(BACKUP_DIR, f);
        console.debug('Deleting backup file:', deletePath);
        return fs.unlink(deletePath);
      })
    );
  } catch (error) {
    console.error('Error during backup creation for slug:', slug, error);
    logger.warn('Failed to create backup', { 
      error: error instanceof Error ? error.message : 'Unknown error',
      slug 
    });
  }
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min read`;
}

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
    .replace(/^-+|-+$/g, '');
}

// Create new blog post
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
    const existingPosts = await fs.readdir(POSTS_DIR);
    if (existingPosts.includes(`${slug}.md`)) {
      throw new BlogError('Post with this title already exists', 'VALIDATION', 400);
    }

    const newPost: BlogPost = {
      id,
      slug,
      title: post.title,
      content: DOMPurify.sanitize(post.content || ''),
      excerpt: post.excerpt || '',
      author: post.author || 'Anonymous',
      publishedAt: post.status === 'published' ? now : undefined,
      updatedAt: now,
      date: now,
      status: post.status || 'draft',
      categories: post.categories || [],
      tags: post.tags || [],
      coverImage: post.coverImage,
      readingTime: calculateReadingTime(post.content || ''),
      searchableContent: `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()
    };

    const fileContent = matter.stringify(newPost.content, {
      ...newPost,
      content: undefined,
    });

    await fs.writeFile(
      path.join(POSTS_DIR, `${slug}.md`),
      fileContent,
      'utf8'
    );

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

// Update existing blog post
export async function updatePost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  try {
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      throw new BlogError('Post not found', 'NOT_FOUND', 404);
    }

    // Create backup before updating
    await createBackup(slug);

    const updatedPost: BlogPost = {
      ...existingPost,
      ...updates,
      updatedAt: new Date().toISOString(),
      publishedAt: updates.status === 'published' 
        ? (existingPost.publishedAt || new Date().toISOString())
        : existingPost.publishedAt,
      content: updates.content ? DOMPurify.sanitize(updates.content) : existingPost.content,
      readingTime: updates.content 
        ? calculateReadingTime(updates.content)
        : existingPost.readingTime,
      searchableContent: updates.content || updates.title || updates.excerpt
        ? `${updates.title || existingPost.title} ${updates.excerpt || existingPost.excerpt} ${updates.content || existingPost.content}`.toLowerCase()
        : existingPost.searchableContent
    };

    const fileContent = matter.stringify(updatedPost.content, {
      ...updatedPost,
      content: undefined,
    });

    await fs.writeFile(
      path.join(POSTS_DIR, `${slug}.md`),
      fileContent,
      'utf8'
    );

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

// Delete blog post
export async function deletePost(slug: string): Promise<void> {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    
    // Check if post exists
    try {
      await fs.access(filePath);
    } catch {
      throw new BlogError('Post not found', 'NOT_FOUND', 404);
    }

    // Create backup before deleting
    await createBackup(slug);
    
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

export async function getPostBySlug(slug: string): Promise<BlogPost> {
  const filePath = path.join(POSTS_DIR, `${slug}.md`);
  console.debug('Fetching post from file:', filePath);
  try {
    const fileContent = await fs.readFile(filePath, 'utf8');
    console.debug('File read successfully for slug:', slug);
    const { data, content } = matter(fileContent);
    console.debug('Front matter data:', data);

    const processedContent = await remark()
      .use(html)
      .process(content);
    const htmlContent = processedContent.toString();

    const words = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    const readingTime = `${minutes} min read`;

    return {
      id: data.id || slug,
      slug,
      title: data.title,
      content: htmlContent,
      excerpt: data.excerpt,
      author: data.author,
      date: data.date,
      updatedAt: data.updatedAt,
      status: data.status || 'draft',
      categories: data.categories || [],
      tags: data.tags || [],
      coverImage: data.coverImage,
      readingTime,
      publishedAt: data.publishedAt,
    };
  } catch (error) {
    console.error(`Error fetching post with slug "${slug}":`, error);
    throw new Error(`Error fetching post with slug "${slug}": ${(error as Error).message}`);
  }
}


// Preview post content
export async function previewPost(content: string): Promise<string> {
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

// Advanced search functionality
export async function searchPosts(params: SearchParams): Promise<{ posts: BlogPost[]; total: number }> {
  try {
    const allPosts = await getAllPosts();
    let filtered = allPosts;

    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(post =>
        post.searchableContent?.includes(query)
      );
    }

    if (params.category) {
      filtered = filtered.filter(post =>
        post.categories.some(cat => 
          cat.toLowerCase() === params.category?.toLowerCase()
        )
      );
    }

    if (params.tag) {
      filtered = filtered.filter(post =>
        post.tags.some(tag => 
          tag.toLowerCase() === params.tag?.toLowerCase()
        )
      );
    }

    if (params.status) {
      filtered = filtered.filter(post => post.status === params.status);
    }

    // Sort results
    const sortKey = params.sortBy || 'date';
    const sortOrder = params.sortOrder || 'desc';
    
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (sortKey) {
        case 'date':
          comparison = new Date(b.publishedAt || b.updatedAt || 0).getTime() -
                      new Date(a.publishedAt || a.updatedAt || 0).getTime();
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'author':
          comparison = a.author.localeCompare(b.author);
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    // Pagination
    const page = params.page || 1;
    const limit = params.limit || 10;
    const start = (page - 1) * limit;
    const paginatedPosts = filtered.slice(start, start + limit);

    return {
      posts: paginatedPosts,
      total: filtered.length,
    };
  } catch (error) {
    logger.error('Failed to search posts', {
      error: error instanceof Error ? error.message : 'Unknown error',
      params
    });
    throw new BlogError(
      'Failed to search posts',
      'UNKNOWN',
      500,
      error
    );
  }
}

// Get all posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const fileNames = await fs.readdir(POSTS_DIRECTORY);
    const postsPromises = fileNames.map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      return getPostBySlug(slug);
    });
    const posts = await Promise.all(postsPromises);
    // Sort posts by date descending
    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    throw new Error(`Error fetching all posts: ${(error as Error).message}`);
  }
}

export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post =>
    post.categories.some(cat => cat.toLowerCase() === category.toLowerCase())
  );
}

export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const allPosts = await getAllPosts();
  return allPosts.filter(post =>
    post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
  );
}

export function generatePostPath(slug: string): string {
  // Simple generation of the post path; adjust if needed
  return `/blog/${slug}`;
}

export type { BlogPost };