// src/utils/__tests__/blogUtils.test.ts

import {
  filterPosts,
  sortPosts,
  paginatePosts,
  calculateReadingTime,
  extractCategories,
  extractTags,
  formatDate,
  createSlug,
} from '../blogUtils';
import { BlogPost, BlogFilterOptions } from '@/types/blog';

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'First Post',
    slug: 'first-post',
    content: 'This is the first post content.',
    excerpt: 'First post excerpt',
    author: 'John Doe',
    date: '2024-01-01',
    categories: ['Norwegian', 'Beginner'],
    tags: ['language', 'learning'],
  },
  {
    id: '2',
    title: 'Second Post',
    slug: 'second-post',
    content: 'Another test post content.',
    excerpt: 'Second post excerpt',
    author: 'Jane Smith',
    date: '2024-01-02',
    categories: ['English', 'Advanced'],
    tags: ['business', 'language'],
  },
];

describe('Blog Utilities', () => {
  describe('filterPosts', () => {
    it('filters posts by category', () => {
      const filtered = filterPosts(mockPosts, { category: 'Norwegian' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('First Post');
    });

    it('filters posts by tag', () => {
      const filtered = filterPosts(mockPosts, { tag: 'business' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('Second Post');
    });

    it('filters posts by search term', () => {
      const filtered = filterPosts(mockPosts, { query: 'first' });
      expect(filtered).toHaveLength(1);
      expect(filtered[0].title).toBe('First Post');
    });
  });

  describe('sortPosts', () => {
    it('sorts posts by date descending by default', () => {
      const sorted = sortPosts(mockPosts);
      expect(sorted[0].title).toBe('Second Post');
    });

    it('sorts posts by title ascending', () => {
      const sorted = sortPosts(mockPosts, 'title', 'asc');
      expect(sorted[0].title).toBe('First Post');
    });
  });

  describe('paginatePosts', () => {
    it('paginates posts correctly', () => {
      const { posts, total } = paginatePosts(mockPosts, { page: 1, limit: 1 });
      expect(posts).toHaveLength(1);
      expect(total).toBe(2);
    });

    it('handles empty pages correctly', () => {
      const { posts, total } = paginatePosts(mockPosts, { page: 3, limit: 1 });
      expect(posts).toHaveLength(0);
      expect(total).toBe(2);
    });
  });

  describe('calculateReadingTime', () => {
    it('calculates reading time for short content', () => {
      const time = calculateReadingTime('Short content');
      expect(time).toBe('1 min read');
    });

    it('calculates reading time for longer content', () => {
      const longContent = Array(1000).fill('word').join(' ');
      const time = calculateReadingTime(longContent);
      expect(time).toBe('5 min read');
    });
  });

  describe('extractCategories', () => {
    it('extracts unique categories with counts', () => {
      const categories = extractCategories(mockPosts);
      expect(categories).toHaveLength(3);
      expect(categories.find(c => c.name === 'Norwegian')?.count).toBe(1);
    });
  });

  describe('extractTags', () => {
    it('extracts unique tags with counts', () => {
      const tags = extractTags(mockPosts);
      expect(tags).toHaveLength(3);
      expect(tags.find(t => t.name === 'language')?.count).toBe(2);
    });
  });

  describe('formatDate', () => {
    it('formats dates correctly', () => {
      const formatted = formatDate('2024-01-01');
      expect(formatted).toBe('January 1, 2024');
    });
  });

  describe('createSlug', () => {
    it('creates valid slugs from text', () => {
      expect(createSlug('Hello World!')).toBe('hello-world');
      expect(createSlug('This is a TEST')).toBe('this-is-a-test');
    });
  });
});