// __tests__/BlogSEO.test.tsx
import { render } from '@testing-library/react';
import BlogSEO from '@/components/seo/BlogSEO';
import { BlogPost } from '@/utils/blog-operations';

const samplePost: BlogPost = {
  id: '1',
  title: 'Test Post',
  slug: 'test-post',
  content: '<p>Sample content</p>',
  excerpt: 'This is a test excerpt.',
  author: 'Test Author',
  publishedAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-02T00:00:00Z',
  status: 'published',
  categories: ['Test'],
  tags: ['sample'],
  coverImage: '/test.jpg'
};

describe('BlogSEO Component', () => {
  it('renders meta description correctly', () => {
    const { container } = render(
      <BlogSEO post={samplePost} canonicalUrl="http://example.com/test-post" />
    );
    const metaDesc = container.querySelector('meta[name="description"]');
    expect(metaDesc?.getAttribute('content')).toBe(samplePost.excerpt);
  });

  // Additional tests can be added for Open Graph and Twitter meta tags
});
