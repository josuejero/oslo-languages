// src/utils/__tests__/blog.test.ts
import { createPost, filterPosts, calculateReadingTime, BlogError } from '../blog';
import { BlogPost } from '@/types/blog';


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
  describe('createPost', () => {
    it('creates a new blog post', async () => {
      const data = {
        title: 'Test Post',
        content: 'Test content',
        excerpt: 'Test excerpt'
      };

      const post = await createPost(data);
      
      expect(post).toHaveProperty('id');
      expect(post.title).toBe(data.title);
      expect(post.slug).toBe('test-post');
    });

    it('throws validation error for missing title', async () => {
      await expect(createPost({}))
        .rejects
        .toThrow(BlogError);
    });
  });

  describe('filterPosts', () => {
    const posts: BlogPost[] = [
      {
        id: '1',
        title: 'Test Post',
        slug: 'test-post',
        content: 'Test content',
        excerpt: 'Test excerpt',
        author: 'Test Author',
        date: '2024-01-01',
        status: 'published',
        categories: ['test'],
        tags: ['test']
      }
    ];

    it('filters posts by category', () => {
      const filtered = filterPosts(posts, { category: 'test' });
      expect(filtered).toHaveLength(1);
    });

    it('filters posts by search term', () => {
      const filtered = filterPosts(posts, { query: 'test' });
      expect(filtered).toHaveLength(1);
    });
  });

  describe('calculateReadingTime', () => {
    it('calculates reading time correctly', () => {
      const content = 'word '.repeat(400);
      expect(calculateReadingTime(content)).toBe('2 min read');
    });
  });
});