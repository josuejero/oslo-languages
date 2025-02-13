// src/components/blog/__tests__/BlogCategories.test.tsx
import { render, screen } from '@testing-library/react';
import BlogCategories from '../BlogCategories';

const mockCategories = [
  { name: 'Norwegian', count: 5, slug: 'norwegian' },
  { name: 'English', count: 3, slug: 'english' },
  { name: 'Learning Tips', count: 2, slug: 'learning-tips' },
];

describe('BlogCategories', () => {
  it('renders all categories with correct counts', () => {
    render(<BlogCategories categories={mockCategories} />);
    
    mockCategories.forEach(category => {
      expect(screen.getByText(category.name)).toBeInTheDocument();
      expect(screen.getByText(category.count.toString())).toBeInTheDocument();
    });
  });

  it('highlights active category', () => {
    render(
      <BlogCategories
        categories={mockCategories}
        activeCategory="norwegian"
      />
    );
    
    const activeLink = screen.getByText('Norwegian').closest('a');
    expect(activeLink).toHaveAttribute('aria-current', 'page');
    expect(activeLink).toHaveClass('bg-blue-600');
  });

  it('renders with custom className', () => {
    render(
      <BlogCategories
        categories={mockCategories}
        className="test-class"
      />
    );
    
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveClass('test-class');
  });

  it('renders navigation landmark with correct label', () => {
    render(<BlogCategories categories={mockCategories} />);
    
    expect(screen.getByRole('navigation'))
      .toHaveAttribute('aria-label', 'Blog categories');
  });
});