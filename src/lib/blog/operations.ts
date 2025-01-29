import matter from 'gray-matter';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import DOMPurify from 'isomorphic-dompurify';
import { remark } from 'remark';
import html from 'remark-html';
import { logger } from '@/lib/logger';

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  publishedAt?: string;
  updatedAt?: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  coverImage?: string;
}

interface SearchParams {
  query?: string;
  category?: string;
  tag?: string;
  status?: 'draft' | 'published';
  page?: number;
  limit?: number;
}

const POSTS_DIR = path.join(process.cwd(), 'content/posts');

// Helper function to ensure posts directory exists
async function ensurePostsDirectory() {
  try {
    await fs.access(POSTS_DIR);
  } catch {
    await fs.mkdir(POSTS_DIR, { recursive: true });
  }
}

// Create new blog post
export async function createPost(post: Partial<BlogPost>): Promise<BlogPost> {
  await ensurePostsDirectory();

  const id = uuidv4();
  const slug = generateSlug(post.title || '');
  const now = new Date().toISOString();

  const newPost: BlogPost = {
    id,
    slug,
    title: post.title || 'Untitled',
    content: post.content || '',
    excerpt: post.excerpt || '',
    author: post.author || 'Anonymous',
    publishedAt: post.status === 'published' ? now : undefined,
    updatedAt: now,
    status: post.status || 'draft',
    categories: post.categories || [],
    tags: post.tags || [],
    coverImage: post.coverImage,
  };

  try {
    const fileContent = matter.stringify(post.content || '', {
      ...newPost,
      content: undefined, // Don't duplicate content in frontmatter
    });

    await fs.writeFile(
      path.join(POSTS_DIR, `${slug}.md`),
      fileContent,
      'utf8'
    );

    logger.info('Post created successfully', { slug, id });
    return newPost;
  } catch (error) {
    logger.error('Failed to create post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    });
    throw new Error('Failed to create post');
  }
}

// Update existing blog post
export async function updatePost(slug: string, updates: Partial<BlogPost>): Promise<BlogPost> {
  try {
    const existingPost = await getPostBySlug(slug);
    if (!existingPost) {
      throw new Error('Post not found');
    }

    const updatedPost: BlogPost = {
      ...existingPost,
      ...updates,
      updatedAt: new Date().toISOString(),
      publishedAt: updates.status === 'published' 
        ? (existingPost.publishedAt || new Date().toISOString())
        : existingPost.publishedAt,
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
    logger.error('Failed to update post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    });
    throw new Error('Failed to update post');
  }
}

// Delete blog post
export async function deletePost(slug: string): Promise<void> {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    await fs.unlink(filePath);
    logger.info('Post deleted successfully', { slug });
  } catch (error) {
    logger.error('Failed to delete post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    });
    throw new Error('Failed to delete post');
  }
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const filePath = path.join(POSTS_DIR, `${slug}.md`);
    const fileContent = await fs.readFile(filePath, 'utf8');
    const { data, content } = matter(fileContent);

    return {
      id: data.id || uuidv4(),
      title: data.title || 'Untitled',
      slug,
      content,
      excerpt: data.excerpt || '',
      author: data.author || 'Anonymous',
      publishedAt: data.publishedAt || null,
      updatedAt: data.updatedAt || data.publishedAt || null,
      status: data.status || 'draft',
      categories: data.categories || [],
      tags: data.tags || [],
      coverImage: data.coverImage || '',
    } as BlogPost;
  } catch (error) {
    logger.error('Failed to get post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug
    });
    return null;
  }
}


// Get all posts
export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const files = await fs.readdir(POSTS_DIR);
    const posts = await Promise.all(
      files
        .filter(filename => filename.endsWith('.md'))
        .map(async filename => {
          const slug = filename.replace('.md', '');
          const post = await getPostBySlug(slug);
          return post;
        })
    );

    return posts
      .filter((post): post is BlogPost => post !== null)
      .sort((a, b) => {
        const dateA = new Date(a.publishedAt || a.updatedAt || 0);
        const dateB = new Date(b.publishedAt || b.updatedAt || 0);
        return dateB.getTime() - dateA.getTime();
      });  } catch (error) {
    logger.error('Failed to get all posts', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return [];
  }
}

// Search and filter posts
export async function searchPosts(params: SearchParams): Promise<{ posts: BlogPost[]; total: number }> {
  try {
    const allPosts = await getAllPosts();
    let filtered = allPosts;

    // Apply filters
    if (params.query) {
      const query = params.query.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.content.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query)
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
    return { posts: [], total: 0 };
  }
}

// Preview post content
export async function previewPost(content: string): Promise<string> {
  try {
    // Sanitize and convert markdown to HTML
    const cleanContent = DOMPurify.sanitize(content);
    const processed = await remark()
      .use(html)
      .process(cleanContent);
    
    return processed.toString();
  } catch (error) {
    logger.error('Failed to generate preview', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new Error('Failed to generate preview');
  }
}

// Helper function to generate URL-friendly slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .replace(/^-+|-+$/g, '');
}