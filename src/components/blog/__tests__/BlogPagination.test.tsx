// src/components/blog/__tests__/BlogPagination.test.tsx
import { render, screen } from '@testing-library/react';
import BlogPagination from '../BlogPagination';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  usePathname: () => '/',
}));

describe('BlogPagination', () => {
  const defaultProps = {
    currentPage: 1,
    totalItems: 30,
    itemsPerPage: 10,
    baseUrl: '/blog/page/',
  };

  it('renders pagination with correct number of pages', () => {
    render(<BlogPagination {...defaultProps} />);
    
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('shows current page as active', () => {
    render(<BlogPagination {...defaultProps} currentPage={2} />);
    
    const currentPage = screen.getByText('2');
    expect(currentPage).toHaveAttribute('aria-current', 'page');
    expect(currentPage.closest('a')).toHaveClass('bg-blue-600');
  });

  it('disables previous button on first page', () => {
    render(<BlogPagination {...defaultProps} />);
    
    const prevButton = screen.getByText('Previous');
    expect(prevButton).toHaveAttribute('aria-disabled', 'true');
    expect(prevButton).toHaveClass('text-gray-400');
  });

  it('disables next button on last page', () => {
    render(<BlogPagination {...defaultProps} currentPage={3} />);
    
    const nextButton = screen.getByText('Next');
    expect(nextButton).toHaveAttribute('aria-disabled', 'true');
    expect(nextButton).toHaveClass('text-gray-400');
  });

  it('shows ellipsis for many pages', () => {
    render(
      <BlogPagination
        {...defaultProps}
        totalItems={100}
        currentPage={5}
      />
    );
    
    const ellipses = screen.getAllByText('...');
    expect(ellipses).toHaveLength(2);
  });

  it('does not render pagination for single page', () => {
    render(
      <BlogPagination
        {...defaultProps}
        totalItems={5}
      />
    );
    
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
  });
});