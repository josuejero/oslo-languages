// src/components/blog/__tests__/BlogTags.test.tsx
import { render, screen } from '@testing-library/react';
import BlogTags from '../BlogTags';

const mockTags = [
  { name: 'Norwegian', count: 10, slug: 'norwegian' },
  { name: 'Beginner', count: 5, slug: 'beginner' },
  { name: 'Grammar', count: 3, slug: 'grammar' },
];

describe('BlogTags', () => {
  it('renders all tags in cloud layout', () => {
    render(<BlogTags tags={mockTags} layout="cloud" />);
    
    mockTags.forEach(tag => {
      const tagElement = screen.getByText(tag.name);
      expect(tagElement).toBeInTheDocument();
      expect(screen.getByText(`(${tag.count})`)).toBeInTheDocument();
    });
  });

  it('renders all tags in list layout', () => {
    render(<BlogTags tags={mockTags} layout="list" />);
    
    mockTags.forEach(tag => {
      expect(screen.getByText(tag.name)).toBeInTheDocument();
      expect(screen.getByText(tag.count.toString())).toBeInTheDocument();
    });
  });

  it('applies different text sizes based on tag count in cloud layout', () => {
    render(<BlogTags tags={mockTags} layout="cloud" />);
    
    const norwegianTag = screen.getByText('Norwegian').closest('a');
    const grammarTag = screen.getByText('Grammar').closest('a');
    
    expect(norwegianTag).toHaveClass('text-xl');
    expect(grammarTag).toHaveClass('text-sm');
  });

  it('highlights active tag', () => {
    render(
      <BlogTags
        tags={mockTags}
        activeTag="norwegian"
        layout="cloud"
      />
    );
    
    const activeTag = screen.getByText('Norwegian').closest('a');
    expect(activeTag).toHaveAttribute('aria-current', 'page');
    expect(activeTag).toHaveClass('bg-blue-600');
  });

  it('renders with custom className', () => {
    render(
      <BlogTags
        tags={mockTags}
        className="test-class"
      />
    );
    
    expect(screen.getByRole('navigation')).toHaveClass('test-class');
  });

  it('renders navigation landmark with correct label', () => {
    render(<BlogTags tags={mockTags} />);
    
    expect(screen.getByRole('navigation'))
      .toHaveAttribute('aria-label', 'Blog tags');
  });
});