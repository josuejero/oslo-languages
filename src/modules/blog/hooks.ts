import { useState, useCallback } from 'react';
import type { BlogPost, BlogFilterOptions } from './types';
import { logger } from '@/utils/logger';

interface SearchResult {
  posts: BlogPost[];
  total: number;
}

/**
 * Custom hook for blog operations
 * 
 * Provides state and methods for interacting with blog posts, including:
 * - Searching posts with filtering and pagination
 * - Fetching individual posts
 * - Creating, updating, and deleting posts
 * - Generating previews of content
 * 
 * @returns Blog operation methods and state
 */
export function useBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Searches for blog posts based on provided parameters
   * 
   * @param params - Search parameters including filters, sorting, and pagination
   * @returns Search results or null if an error occurred
   */
  const searchPosts = useCallback(async (params: BlogFilterOptions): Promise<SearchResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // Build query string
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) searchParams.append(key, value.toString());
      });

      const response = await fetch(`/api/v1/blog?${searchParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to search posts';
      setError(message);
      logger.error('Search posts error', { error: message });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Fetches a single blog post by its slug
   * 
   * @param slug - The post's unique slug
   * @returns The blog post or null if not found or an error occurred
   */
  const getPost = useCallback(async (slug: string): Promise<BlogPost | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/blog/${slug}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { post } = await response.json();
      return post;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get post';
      setError(message);
      logger.error('Get post error', { error: message, slug });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Creates a new blog post
   * 
   * @param data - The post data to create
   * @returns The created post or null if an error occurred
   */
  const createPost = useCallback(async (data: Partial<BlogPost>): Promise<BlogPost | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { post } = await response.json();
      return post;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to create post';
      setError(message);
      logger.error('Create post error', { error: message });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Updates an existing blog post
   * 
   * @param slug - The post's unique slug
   * @param data - The post data to update
   * @returns The updated post or null if an error occurred
   */
  const updatePost = useCallback(async (slug: string, data: Partial<BlogPost>): Promise<BlogPost | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/blog/${slug}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { post } = await response.json();
      return post;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update post';
      setError(message);
      logger.error('Update post error', { error: message, slug });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deletes a blog post
   * 
   * @param slug - The post's unique slug
   * @returns true if successful, false otherwise
   */
  const deletePost = useCallback(async (slug: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/v1/blog/${slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete post';
      setError(message);
      logger.error('Delete post error', { error: message, slug });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Generates a preview of markdown content
   * 
   * @param content - Markdown content to preview
   * @returns HTML string or null if an error occurred
   */
  const previewContent = useCallback(async (content: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/v1/blog/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const { html } = await response.json();
      return html;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to preview content';
      setError(message);
      logger.error('Preview content error', { error: message });
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // State
    loading,
    error,
    
    // Methods
    searchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    previewContent,
    
    // Utility
    clearError: () => setError(null),
  };
}

// Default export for easier imports
export default useBlog;