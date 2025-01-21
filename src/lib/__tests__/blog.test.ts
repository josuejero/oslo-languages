// src/lib/__tests__/blog.test.ts
import fs from 'fs/promises';
import path from 'path';
import { 
  getPostBySlug, 
  getAllPosts, 
  getPostsByCategory, 
  getPostsByTag,
  generatePostPath 
} from '../blog';

// Mock fs module
jest.mock('fs/promises');
jest.mock('path');

// Mock posts data
const mockPosts = [
  {
    slug: 'first-post',
    content: '# First Post\nThis is a test post with some content.\nIt has multiple paragraphs.\nAnd some more text.',
    data: {
      title: 'First Post',
      date: '2024-01-01',
      excerpt: 'First post excerpt',
      author: 'John Doe',
      categories: ['Norwegian', 'Beginner'],
      tags: ['language', 'learning'],
      coverImage: '/images/post1.jpg'
    }
  },
  {
    slug: 'second-post',
    content: '# Second Post\nAnother test post.\nWith different content.',
    data: {
      title: 'Second Post',
      date: '2024-01-02',
      excerpt: 'Second post excerpt',
      author: 'Jane Smith',
      categories: ['English', 'Advanced'],
      tags: ['business', 'language'],
      coverImage: '/images/post2.jpg'
    }
  },
  {
    slug: 'third-post',
    content: '# Third Post\nYet another post.\nThis one is shorter.',
    data: {
      title: 'Third Post',
      date: '2024-01-03',
      excerpt: 'Third post excerpt',
      author: 'John Doe',
      categories: ['Norwegian', 'Advanced'],
      tags: ['learning', 'culture'],
      coverImage: '/images/post3.jpg'
    }
  }
];

// Setup mock filesystem
beforeAll(() => {
  const mockFileSystem: Record<string, string> = mockPosts.reduce((acc: Record<string, string>, post) => {
    acc[`${post.slug}.md`] = `---
title: ${post.data.title}
date: ${post.data.date}
excerpt: ${post.data.excerpt}
author: ${post.data.author}
categories: ${JSON.stringify(post.data.categories)}
tags: ${JSON.stringify(post.data.tags)}
coverImage: ${post.data.coverImage}
---

${post.content}`;
    return acc;
  }, {});

  // Mock fs.readdir
  (fs.readdir as jest.Mock).mockResolvedValue(Object.keys(mockFileSystem));

  // Mock fs.readFile
  (fs.readFile as jest.Mock).mockImplementation((filePath) => {
    const fileName = path.basename(filePath);
    const content = mockFileSystem[fileName];
    if (!content) throw new Error(`File not found: ${fileName}`);
    return Promise.resolve(content);
  });

  // Mock path.join to return the file name
  (path.join as jest.Mock).mockImplementation((...args) => args[args.length - 1]);
});

describe('Blog Functions', () => {
  describe('Post Retrieval', () => {
    it('should retrieve a single post by slug', async () => {
      const post = await getPostBySlug('first-post');
      
      expect(post).toBeDefined();
      expect(post.title).toBe('First Post');
      expect(post.content).toContain('<h1>First Post</h1>');
      expect(post.author).toBe('John Doe');
    });

    it('should retrieve all posts sorted by date', async () => {
      const posts = await getAllPosts();
      
      expect(posts).toHaveLength(3);
      expect(posts[0].title).toBe('Third Post'); // Most recent first
      expect(posts[2].title).toBe('First Post'); // Oldest last
    });

    it('should handle non-existent post slugs', async () => {
      await expect(getPostBySlug('non-existent')).rejects.toThrow();
    });

    it('should correctly parse markdown content', async () => {
      const post = await getPostBySlug('first-post');
      
      expect(post.content).toContain('<h1>');
      expect(post.content).toContain('<p>');
      expect(post.content).not.toContain('#');
    });
  });

  describe('Category Filtering', () => {
    it('should filter posts by category', async () => {
      const norwegianPosts = await getPostsByCategory('Norwegian');
      
      expect(norwegianPosts).toHaveLength(2);
      expect(norwegianPosts.every(post => 
        post.categories.includes('Norwegian')
      )).toBe(true);
    });

    it('should handle category case-insensitively', async () => {
      const norwegianPosts = await getPostsByCategory('norwegian');
      const advancedPosts = await getPostsByCategory('ADVANCED');
      
      expect(norwegianPosts).toHaveLength(2);
      expect(advancedPosts).toHaveLength(2);
    });

    it('should return empty array for non-existent category', async () => {
      const posts = await getPostsByCategory('non-existent');
      
      expect(posts).toHaveLength(0);
    });

    it('should maintain post order within category', async () => {
      const norwegianPosts = await getPostsByCategory('Norwegian');
      
      expect(new Date(norwegianPosts[0].date).getTime()).toBeGreaterThan(new Date(norwegianPosts[1].date).getTime());
    });
  });

  describe('Tag Filtering', () => {
    it('should filter posts by tag', async () => {
      const learningPosts = await getPostsByTag('learning');
      
      expect(learningPosts).toHaveLength(2);
      expect(learningPosts.every(post => 
        post.tags.includes('learning')
      )).toBe(true);
    });

    it('should handle tag case-insensitively', async () => {
      const learningPosts = await getPostsByTag('LEARNING');
      const businessPosts = await getPostsByTag('business');
      
      expect(learningPosts).toHaveLength(2);
      expect(businessPosts).toHaveLength(1);
    });

    it('should return empty array for non-existent tag', async () => {
      const posts = await getPostsByTag('non-existent');
      
      expect(posts).toHaveLength(0);
    });

    it('should maintain post order within tag', async () => {
      const learningPosts = await getPostsByTag('learning');
      
      expect(new Date(learningPosts[0].date).getTime()).toBeGreaterThan(new Date(learningPosts[1].date).getTime());
    });
  });

  describe('Reading Time Calculation', () => {
    it('should calculate reading time for short posts', async () => {
      const post = await getPostBySlug('third-post');
      expect(post.readingTime).toBe('1 min read');
    });

    it('should calculate reading time for longer posts', async () => {
      // Create a longer post content
      const longContent = 'word '.repeat(1000); // 1000 words
      (fs.readFile as jest.Mock).mockResolvedValueOnce(`---
title: Long Post
date: 2024-01-04
excerpt: Long post excerpt
author: John Doe
categories: ["Test"]
tags: ["test"]
coverImage: /images/long.jpg
---

${longContent}`);

      const post = await getPostBySlug('long-post');
      expect(post.readingTime).toBe('5 min read');
    });

    it('should round reading time up to nearest minute', async () => {
      // Create a post with 250 words (should round up to 2 minutes)
      const mediumContent = 'word '.repeat(250);
      (fs.readFile as jest.Mock).mockResolvedValueOnce(`---
title: Medium Post
date: 2024-01-04
excerpt: Medium post excerpt
author: John Doe
categories: ["Test"]
tags: ["test"]
coverImage: /images/medium.jpg
---

${mediumContent}`);

      const post = await getPostBySlug('medium-post');
      expect(post.readingTime).toBe('2 min read');
    });

    it('should handle posts with code blocks', async () => {
      const postWithCode = `---
title: Code Post
date: 2024-01-04
excerpt: Code post excerpt
author: John Doe
categories: ["Test"]
tags: ["test"]
coverImage: /images/code.jpg
---

Here's some regular text.

\`\`\`javascript
function example() {
  return 'Hello World';
}
\`\`\`

More text here.`;

      (fs.readFile as jest.Mock).mockResolvedValueOnce(postWithCode);

      const post = await getPostBySlug('code-post');
      expect(post.readingTime).toBeDefined();
      expect(typeof post.readingTime).toBe('string');
    });
  });

  describe('Path Generation', () => {
    it('should generate correct post paths', () => {
      expect(generatePostPath('test-post')).toBe('/blog/test-post');
    });

    it('should handle slugs with special characters', () => {
      expect(generatePostPath('test-post-123!')).toBe('/blog/test-post-123!');
    });
  });
});