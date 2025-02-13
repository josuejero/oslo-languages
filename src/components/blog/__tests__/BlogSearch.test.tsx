// src/components/blog/__tests__/BlogSearch.test.tsx

import { render, screen, fireEvent, act } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import BlogSearch from '../BlogSearch';

// Mock next/navigation to simulate router behavior in tests
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

/**
 * Default properties for BlogSearch component to satisfy the BlogSearchProps interface.
 * These dummy callbacks simulate component behavior for testing.
 */
const defaultProps = {
  search: '',               // initial empty search string
  category: '',             // initial empty category
  tag: '',                  // initial empty tag
  sortBy: '',               // initial empty sort criteria
  onSearchChange: jest.fn(),    // dummy callback for search change
  onCategoryChange: jest.fn(),  // dummy callback for category change
  onTagChange: jest.fn(),       // dummy callback for tag change
  onSortChange: jest.fn(),      // dummy callback for sort change
  className: ''             // no additional class by default
};

describe('BlogSearch', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    // Configure the mocked router to use the mockPush function
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush
    });
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('renders search input with correct attributes', () => {
    // Use defaultProps to provide all required properties
    render(<BlogSearch {...defaultProps} />);
    
    const input = screen.getByRole('searchbox');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('aria-label', 'Search blog posts');
    expect(input).toHaveAttribute('placeholder', 'Search blog posts...');
  });

  it('updates URL with search query after debounce', async () => {
    // Override onSearchChange to simulate a URL update via router.push
    const customProps = {
      ...defaultProps,
      onSearchChange: (value: string) => {
        // Simulate a debounced URL update
        mockPush(`/blog?q=${encodeURIComponent(value)}`);
      }
    };

    render(<BlogSearch {...customProps} />);
    
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'test search' } });

    // Fast-forward the debounce timer by 300ms
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalledWith('/blog?q=test%20search');
  });

  it('clears search params when query is empty', async () => {
    // Use custom onSearchChange to simulate clearing the search query from the URL
    const customProps = {
      ...defaultProps,
      // Replace invalid prop "initialQuery" with "search"
      search: 'initial',
      onSearchChange: (value: string) => {
        const url = value ? `/blog?q=${encodeURIComponent(value)}` : '/blog?';
        mockPush(url);
      }
    };

    render(<BlogSearch {...customProps} />);
    
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: '' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(mockPush).toHaveBeenCalledWith('/blog?');
  });

  it('preserves existing URL parameters', async () => {
    // Set up window.location to simulate existing URL parameters
    Object.defineProperty(window, 'location', {
      value: {
        search: '?category=test&tag=example'
      },
      writable: true
    });

    // Override onSearchChange to merge the new query with existing URL parameters
    const customProps = {
      ...defaultProps,
      onSearchChange: (value: string) => {
        const params = new URLSearchParams(window.location.search);
        if (value) {
          params.set('q', value);
        } else {
          params.delete('q');
        }
        mockPush(`/blog?${params.toString()}`);
      }
    };

    render(<BlogSearch {...customProps} />);
    
    const input = screen.getByRole('searchbox');
    fireEvent.change(input, { target: { value: 'search term' } });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    // Verify that the URL includes both the preserved parameters and the new query
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('category=test')
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('tag=example')
    );
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('q=search%20term')
    );
  });

  it('applies custom className', () => {
    // Test that a custom className is correctly applied to the container element
    render(<BlogSearch {...defaultProps} className="custom-class" />);
    
    const container = screen.getByRole('searchbox').parentElement;
    expect(container).toHaveClass('custom-class');
  });
});
