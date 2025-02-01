// src/lib/hooks/useBlog.ts
import { useState, useCallback } from 'react';
import { BlogPost } from '@/lib/blog/operations';
import { logger } from '@/lib/logger';

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

interface SearchResult {
  posts: BlogPost[];
  total: number;
}

export function useBlog() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPosts = useCallback(async (params: SearchParams): Promise<SearchResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // Build query string
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value) searchParams.append(key, value.toString());
      });

      const response = await fetch(`/api/blog?${searchParams.toString()}`);
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

  const getPost = useCallback(async (slug: string): Promise<BlogPost | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${slug}`);
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

  const createPost = useCallback(async (data: Partial<BlogPost>): Promise<BlogPost | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/blog', {
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

  const updatePost = useCallback(async (slug: string, data: Partial<BlogPost>): Promise<BlogPost | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${slug}`, {
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

  const deletePost = useCallback(async (slug: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/blog/${slug}`, {
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

  const previewContent = useCallback(async (content: string): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/blog/preview', {
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
    loading,
    error,
    searchPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    previewContent,
    clearError: () => setError(null),
  };
}