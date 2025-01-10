import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

// Mock useRouter
jest.mock('next/router', () => ({
  useRouter() {
    return {
      pathname: '/',
    };
  },
}));

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(<Header />);
    
    // Check logo
    expect(screen.getByText('Oslo Languages')).toBeInTheDocument();
    
    // Check navigation links
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /courses/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact/i })).toBeInTheDocument();
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    
    // Mobile menu should be hidden initially
    expect(screen.getByRole('navigation')).toHaveClass('hidden');
    
    // Click hamburger menu
    fireEvent.click(screen.getByRole('button', { name: /open main menu/i }));
    
    // Mobile menu should be visible
    expect(screen.getByRole('navigation')).not.toHaveClass('hidden');
    
    // Click again to hide
    fireEvent.click(screen.getByRole('button', { name: /open main menu/i }));
    
    // Mobile menu should be hidden again
    expect(screen.getByRole('navigation')).toHaveClass('hidden');
  });

  it('shows correct active link', () => {
    render(<Header />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    expect(homeLink).toHaveClass('text-accent-primary');
  });
});