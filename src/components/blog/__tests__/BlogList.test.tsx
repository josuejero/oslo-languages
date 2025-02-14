// src/components/blog/__tests__/BlogList.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogList from '../BlogList';
import { BlogPost } from '@/types/blog';

// Mock the OptimizedImage component
jest.mock('@/components/OptimizedImage', () => {
  return function MockOptimizedImage({ alt }: { alt: string }) {
    return <img alt={alt} />;
  };
});

const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'First Post',
    slug: 'first-post',
    content: 'Content of first post',
    excerpt: 'First post excerpt',
    author: 'John Doe',
    date: '2024-01-01',
    categories: ['Norwegian', 'Beginner'],
    tags: ['language', 'learning'],
    coverImage: '/images/post1.jpg'
  },
  {
    id: '2',
    title: 'Second Post',
    slug: 'second-post',
    content: 'Content of second post',
    excerpt: 'Second post excerpt',
    author: 'Jane Smith',
    date: '2024-01-02',
    categories: ['English', 'Advanced'],
    tags: ['business', 'language'],
    coverImage: '/images/post2.jpg'
  }
];

describe('Consolidated BlogList', () => {
  it('handles category filtering from consolidated API', async () => {
    const mockPostsForFilter: BlogPost[] = [
      {
        id: '1',
        slug: 'test-post',
        title: 'Test Post',
        content: 'Dummy content for test post',
        excerpt: 'Test post excerpt',
        author: 'Tester',
        date: '2024-01-01',
        categories: ['test'],
        tags: ['example'],
        coverImage: '/images/test.jpg'
      },
      {
        id: '2',
        slug: 'other-post',
        title: 'Other Post',
        content: 'Dummy content for other post',
        excerpt: 'Other post excerpt',
        author: 'Tester',
        date: '2024-01-02',
        categories: ['other'],
        tags: ['example'],
        coverImage: '/images/other.jpg'
      }
    ];
    
    render(<BlogList posts={mockPostsForFilter} />);
    
    const categoryButton = screen.getByText('test');
    fireEvent.click(categoryButton);
    
    await waitFor(() => {
      expect(screen.getByText('Test Post')).toBeInTheDocument();
      expect(screen.queryByText('Other Post')).not.toBeInTheDocument();
    });
  });
});

describe('BlogList Component', () => {
  it('renders a list of blog posts', () => {
    render(<BlogList posts={mockPosts} />);
    
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('displays "No posts found" when there are no posts', () => {
    render(<BlogList posts={[]} />);
    
    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });

  it('displays categories and allows filtering by category', () => {
    render(<BlogList posts={mockPosts} />);
    
    const categoryButton = screen.getByText('Norwegian');
    fireEvent.click(categoryButton);
    
    // After filtering, only the first post should be visible
    expect(screen.getByText('First Post')).toBeInTheDocument();
    expect(screen.queryByText('Second Post')).not.toBeInTheDocument();
  });

  it('displays tags and allows filtering by tag', () => {
    render(<BlogList posts={mockPosts} />);
    
    const tagButton = screen.getByText('#business');
    fireEvent.click(tagButton);
    
    // After filtering, only the second post should be visible
    expect(screen.queryByText('First Post')).not.toBeInTheDocument();
    expect(screen.getByText('Second Post')).toBeInTheDocument();
  });

  it('displays pagination controls when there are more posts than the limit', () => {
    render(
      <BlogList 
        posts={mockPosts} 
        pagination={{ page: 1, limit: 1 }}
      />
    );
    
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('disables pagination buttons appropriately', () => {
    render(
      <BlogList 
        posts={mockPosts} 
        pagination={{ page: 1, limit: 1 }}
      />
    );
    
    const previousButton = screen.getByText('Previous');
    const nextButton = screen.getByText('Next');
    
    expect(previousButton).toBeDisabled();
    expect(nextButton).not.toBeDisabled();
  });

  it('formats dates correctly', () => {
    render(<BlogList posts={mockPosts} />);
    
    expect(screen.getByText('January 1, 2024')).toBeInTheDocument();
    expect(screen.getByText('January 2, 2024')).toBeInTheDocument();
  });

  it('renders post excerpts', () => {
    render(<BlogList posts={mockPosts} />);
    
    expect(screen.getByText('First post excerpt')).toBeInTheDocument();
    expect(screen.getByText('Second post excerpt')).toBeInTheDocument();
  });

  it('links to individual post pages', () => {
    render(<BlogList posts={mockPosts} />);
    
    const firstPostLink = screen.getByRole('link', { name: 'First Post' });
    expect(firstPostLink).toHaveAttribute('href', '/blog/first-post');
  });

  it('applies custom className', () => {
    const { container } = render(
      <BlogList posts={mockPosts} className="custom-class" />
    );
    
    expect(container.firstChild).toHaveClass('custom-class');
  });
});
