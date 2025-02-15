// src/components/blog/__tests__/BlogPost.test.tsx
import { render, screen, waitFor, within, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BlogPost from '../BlogPost';
import { BlogPost as BlogPostType } from '@/utils/blog';
import * as React from 'react';

jest.mock('next/head', () => {
  const MockHead = ({ children }: { children: React.ReactNode }): null => {
    React.useEffect(() => {
      // Remove previous head elements added by MockHead
      const existing = document.querySelectorAll('[data-mock-head]');
      existing.forEach((el) => el.parentNode?.removeChild(el));
      React.Children.forEach(children, (child: React.ReactNode) => {
        if (React.isValidElement(child) && child.props) {
          const el = document.createElement(child.type as string);
          Object.entries(child.props).forEach(([key, value]) => {
            if (key !== 'children') {
              el.setAttribute(key, value as string);
            }
          });
          if (child.props.children) {
            el.textContent = child.props.children;
          }
          el.setAttribute('data-mock-head', 'true');
          document.head.appendChild(el);
        }
      });
    }, [children]);
    return null;
  };
  MockHead.displayName = 'MockHead';
  return { __esModule: true, default: MockHead };
});

jest.mock('lucide-react', () => {
  const MockTwitter = (props: any) => <span {...props}>TwitterIcon</span>;
  MockTwitter.displayName = 'MockTwitter';
  const MockLinkedin = (props: any) => <span {...props}>LinkedInIcon</span>;
  MockLinkedin.displayName = 'MockLinkedin';
  const MockMail = (props: any) => <span {...props}>MailIcon</span>;
  MockMail.displayName = 'MockMail';
  const MockChevronDown = (props: any) => <span {...props}>ChevronDown</span>;
  MockChevronDown.displayName = 'MockChevronDown';
  const MockChevronUp = (props: any) => <span {...props}>ChevronUp</span>;
  MockChevronUp.displayName = 'MockChevronUp';
  return {
    Twitter: MockTwitter,
    Linkedin: MockLinkedin,
    Mail: MockMail,
    ChevronDown: MockChevronDown,
    ChevronUp: MockChevronUp,
  };
});

// Mock Next/Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    const { fill, priority, blurDataURL, ...rest } = props;
    return <img {...rest} />;
  }
}));



// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

jest.mock('react-intersection-observer', () => ({
  useInView: () => ({ ref: jest.fn(), inView: true })
}));

describe('BlogPost', () => {
  const mockPost: BlogPostType = {
    id: 'test-post-id',
    slug: 'test-post',
    title: 'Test Blog Post',
    date: '2024-01-20',
    excerpt: 'This is a test blog post',
    author: 'John Doe',
    content:
      '<h1>Test Blog Post</h1><p>This is test content.</p><pre><code>const test = "code";</code></pre>',
    categories: ['Test', 'Example'],
    tags: ['test', 'example'],
    coverImage: '/images/test.jpg',
    readingTime: '3 min read'
  };

  it('should have proper ARIA labels', () => {
    render(<BlogPost post={mockPost} />);
    expect(screen.getByRole('article')).toHaveAttribute('aria-labelledby');
    expect(screen.getByRole('region', { name: 'Share options' }))
      .toHaveAttribute('aria-label', 'Share options');
  });



  it('should update metadata when post changes', () => {
    const { rerender } = render(<BlogPost post={mockPost} />);
    const updatedPost = { ...mockPost, title: 'Updated Title', excerpt: 'Updated excerpt' };
    rerender(<BlogPost post={updatedPost} />);
    const metaTags = document.head.querySelectorAll('meta');
    expect(metaTags).not.toHaveLength(0);
  });

  describe('Content Rendering', () => {
    it('should render the post title and metadata', () => {
      render(<BlogPost post={mockPost} />);
      const headerTitle = screen.getByTestId('blog-post-title');
      expect(headerTitle).toBeInTheDocument();
      expect(headerTitle).toHaveAttribute('id', 'blog-post-title');
      expect(screen.getByText(mockPost.author)).toBeInTheDocument();
      expect(screen.getByText('January 19, 2024')).toBeInTheDocument();
      expect(screen.getByText('3 min read')).toBeInTheDocument();
    });

    it('should render categories as clickable links', () => {
      render(<BlogPost post={mockPost} />);
      const categoriesNav = screen.getByLabelText('Post categories');
      mockPost.categories.forEach((category: string) => {
        const categoryLink = within(categoriesNav).getByRole('link', { name: category });
        expect(categoryLink).toBeInTheDocument();
        expect(categoryLink).toHaveAttribute('href', expect.stringContaining('/blog/category/'));
      });
    });

    it('should render tags with proper formatting', () => {
      render(<BlogPost post={mockPost} />);
      mockPost.tags.forEach((tag: string) => {
        const tagLink = screen.getByRole('link', { name: new RegExp(`#${tag}`, 'i') });
        expect(tagLink).toBeInTheDocument();
        expect(tagLink).toHaveAttribute('href', expect.stringContaining('/blog/tag/'));
      });
    });

    it('should handle posts without optional fields', () => {
      const minimalPost: BlogPostType = {
        ...mockPost,
        categories: [],
        tags: [],
        coverImage: '/images/default.jpg'
      };
      render(<BlogPost post={minimalPost} />);
      expect(screen.queryByRole('img')).toBeInTheDocument();
      expect(screen.queryByTestId('categories')).not.toBeInTheDocument();
      expect(screen.queryByTestId('tags')).not.toBeInTheDocument();
    });
  });

  describe('Rich Text Handling', () => {
    const richTextPost: BlogPostType = {
      ...mockPost,
      content: `
        <h1>Main Title</h1>
        <p>Regular paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
        <h2>Subheading</h2>
        <ul>
          <li>List item 1</li>
          <li>List item 2</li>
        </ul>
        <pre><code class="language-javascript">
        const example = "code block";
        console.log(example);
        </code></pre>
        <blockquote>
          <p>This is a quote</p>
        </blockquote>
      `
    };

    it('should render HTML elements with proper styling', () => {
      render(<BlogPost post={richTextPost} />);
      expect(screen.getByText('Main Title')).toHaveClass('prose-h1');
      expect(screen.getByRole('heading', { level: 2, name: 'Subheading' })).toHaveClass('prose-h2');
      expect(screen.getByText(/Regular paragraph/)).toHaveClass('prose-p');
    });

    it('should render code blocks with syntax highlighting', () => {
      render(<BlogPost post={richTextPost} />);
      const codeBlock = screen.getByText(/const example/);
      expect(codeBlock).toBeInTheDocument();
      expect(codeBlock.closest('pre')).toHaveClass('language-javascript');
    });

    it('should handle markdown tables correctly', () => {
      const postWithTable: BlogPostType = {
        ...mockPost,
        content: `
          <table>
            <thead>
              <tr><th>Header 1</th><th>Header 2</th></tr>
            </thead>
            <tbody>
              <tr><td>Cell 1</td><td>Cell 2</td></tr>
            </tbody>
          </table>
        `
      };
      render(<BlogPost post={postWithTable} />);
      expect(screen.getByRole('table')).toBeInTheDocument();
      expect(screen.getAllByRole('row')).toHaveLength(2);
    });

    it('should sanitize potentially unsafe HTML', () => {
      const postWithUnsafeContent: BlogPostType = {
        ...mockPost,
        content: `
          <p>Safe content</p>
          <script>alert('unsafe');</script>
          <img src="x" onerror="alert('unsafe')">
        `
      };
      render(<BlogPost post={postWithUnsafeContent} />);
      expect(screen.getByText('Safe content')).toBeInTheDocument();
      const richContent = screen.getByTestId('rich-content');
      expect(within(richContent).queryByRole('script')).not.toBeInTheDocument();
      const img = document.querySelector('img');
      expect(img?.getAttribute('onerror')).toBeNull();
    });
  });


  describe('SEO Metadata', () => {
    it('should render OG metadata tags', () => {
      render(<BlogPost post={mockPost} />);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle).toHaveAttribute('content', mockPost.title);
      const ogDescription = document.querySelector('meta[property="og:description"]');
      expect(ogDescription).toHaveAttribute('content', mockPost.excerpt);
      const ogImage = document.querySelector('meta[property="og:image"]');
      expect(ogImage).toHaveAttribute('content', mockPost.coverImage);
    });

    it('should render schema.org metadata', () => {
      render(<BlogPost post={mockPost} />);
      const script = document.querySelector('script[type="application/ld+json"]');
      expect(script).toBeInTheDocument();
      const schema = JSON.parse(script!.innerHTML);
      expect(schema['@type']).toBe('BlogPosting');
      expect(schema.headline).toBe(mockPost.title);
      expect(schema.author.name).toBe(mockPost.author);
    });

    it('should update metadata when post changes', () => {
      const { rerender } = render(<BlogPost post={mockPost} />);
      const updatedPost: BlogPostType = { ...mockPost, title: 'Updated Title', excerpt: 'Updated excerpt' };
      rerender(<BlogPost post={updatedPost} />);
      const ogTitle = document.querySelector('meta[property="og:title"]');
      expect(ogTitle).toHaveAttribute('content', 'Updated Title');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      expect(ogDescription).toHaveAttribute('content', 'Updated excerpt');
    });

    it('should have proper canonical URL', () => {
      render(<BlogPost post={mockPost} />);
      const canonical = document.querySelector('link[rel="canonical"]');
      expect(canonical).toHaveAttribute('href', expect.stringContaining(mockPost.slug));
    });
  });

  describe('Accessibility', () => {
    it('should have proper heading hierarchy', () => {
      render(<BlogPost post={mockPost} />);
      const headings = screen.getAllByRole('heading');
      const levels = headings.map((h) => parseInt(h.tagName.replace('H', '')));
      expect(Math.min(...levels)).toBe(1);
      expect(levels).toEqual(levels.slice().sort((a, b) => a - b));
    });

    it('should have proper ARIA labels', () => {
      render(<BlogPost post={mockPost} />);
      expect(screen.getByRole('article')).toHaveAttribute('aria-labelledby');
      expect(screen.getByRole('region', { name: 'Share options' }))
        .toHaveAttribute('aria-label', 'Share options');
    });


  });
});
