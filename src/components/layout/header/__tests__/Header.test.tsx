// src/components/layout/header/__tests__/Header.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import Header from '../Header';

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe('Header', () => {
  it('renders logo and navigation links', () => {
    render(<Header />);
    
    // Check logo specifically
    expect(screen.getByRole('link', { name: /oslo languages/i })).toBeInTheDocument();
    
    // Check desktop navigation links only
    const desktopNav = screen.getByRole('navigation').querySelector('.md\\:flex');
    const desktopLinks = desktopNav?.querySelectorAll('a');
    expect(desktopLinks).toBeDefined();
    expect(desktopLinks?.length).toBe(4); // Home, Courses, About, Contact
  });

  it('toggles mobile menu', () => {
    render(<Header />);
    
    const mobileMenu = screen.getByRole('menu');
    const menuButton = screen.getByRole('button', { name: /open main menu/i });
    
    // Initially hidden
    expect(mobileMenu).toHaveClass('hidden');
    
    // Show menu
    fireEvent.click(menuButton);
    expect(mobileMenu).not.toHaveClass('hidden');
    
    // Hide menu
    fireEvent.click(menuButton);
    expect(mobileMenu).toHaveClass('hidden');
  });

  it('shows correct active link styling', () => {
    render(<Header />);
    
    // Find home link in desktop navigation
    const desktopNav = screen.getByRole('navigation').querySelector('.md\\:flex');
    const homeLink = desktopNav?.querySelector('a[href="/"]');
    
    // Since path is '/' (from mock), home should have active styling
    expect(homeLink).toHaveClass('bg-blue-600', 'text-white');
  });
});