// src/components/blog/__tests__/BlogSearch.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BlogSearch from '../BlogSearch';

describe('BlogSearch Component', () => {
  const mockOnSearchChange = jest.fn();
  const mockOnCategoryChange = jest.fn();
  const mockOnTagChange = jest.fn();
  const mockOnSortChange = jest.fn();

  beforeEach(() => {
    render(
      <BlogSearch
        search=""
        category=""
        tag=""
        sortBy="date-desc"
        onSearchChange={mockOnSearchChange}
        onCategoryChange={mockOnCategoryChange}
        onTagChange={mockOnTagChange}
        onSortChange={mockOnSortChange}
      />
    );
  });

  it('renders input and select elements', () => {
    expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Sort posts by' })).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in the search input', async () => {
    const input = screen.getByPlaceholderText('Search posts...');
    fireEvent.change(input, { target: { value: 'react' } });
    
    await waitFor(() => {
      expect(mockOnSearchChange).toHaveBeenCalledWith('react');
    }, { timeout: 400 });
  });

  it('calls onCategoryChange when changing the category', () => {
    const select = screen.getByRole('combobox', { name: 'Filter by category' });
    fireEvent.change(select, { target: { value: 'tech' } });
    expect(mockOnCategoryChange).toHaveBeenCalledWith('tech');
  });

  it('calls onTagChange when changing the tag', () => {
    // Select the second select (tag selector)
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[1], { target: { value: 'react' } });
    expect(mockOnTagChange).toHaveBeenCalledWith('react');
  });

  it('calls onSortChange when changing the sort order', () => {
    // Select the third select (sort selector)
    const selects = screen.getAllByRole('combobox');
    fireEvent.change(selects[2], { target: { value: 'title-asc' } });
    expect(mockOnSortChange).toHaveBeenCalledWith('title-asc');
  });
});
