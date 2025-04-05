'use client';

import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Define navigation links
const navigationLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' }
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [firstFocusable, setFirstFocusable] = useState<HTMLElement | null>(null);
  const [lastFocusable, setLastFocusable] = useState<HTMLElement | null>(null);
  const pathname = usePathname();

  // Manage focus when the mobile menu opens
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      setFirstFocusable(focusableElements[0] || null);
      setLastFocusable(focusableElements[focusableElements.length - 1] || null);
      // Focus the first focusable element
      focusableElements[0]?.focus();
    }
  }, [isMenuOpen]);

  // Handle keyboard navigation and close on Escape
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isMenuOpen) return;
    const { key, shiftKey } = event;

    // Close menu on Escape key
    if (key === 'Escape') {
      setIsMenuOpen(false);
      buttonRef.current?.focus();
      return;
    }

    // Trap focus within the mobile menu
    if (key === 'Tab') {
      if (!firstFocusable || !lastFocusable) return;
      if (shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      } else if (!shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  // Close the menu if a click occurs outside it
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle Escape key and lock body scroll when mobile menu is open
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    // Lock body scroll when menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    
    return () => {
      document.removeEventListener('keydown', handleEscKey);
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  return (
    <nav aria-label="Main navigation" className="relative">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-600 p-2 z-50"
      >
        Skip to main content
      </a>

      {/* Desktop Navigation */}
      <div className="hidden md:flex space-x-4">
        {navigationLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            aria-current={pathname === href ? 'page' : undefined}
            className={`
              px-3 py-2 rounded-md text-sm font-medium
              ${pathname === href
                ? 'bg-blue-600 text-white'
                : 'text-white hover:bg-white/10 hover:text-white'
              }
              focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-blue-700
            `}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Toggle Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
      >
        <span className="sr-only">
          {isMenuOpen ? 'Close main menu' : 'Open main menu'}
        </span>
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              isMenuOpen
                ? 'M6 18L18 6M6 6l12 12'
                : 'M4 6h16M4 12h16M4 18h16'
            }
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        onKeyDown={handleKeyDown}
        className={`
          absolute top-full right-0 w-56 md:hidden z-50
          ${isMenuOpen ? 'block' : 'hidden'}
        `}
        role="menu"
        aria-orientation="vertical"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-md border mt-2">
          {navigationLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`
                block px-3 py-2 rounded-md text-base font-medium
                ${pathname === href
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                }
                focus:outline-none focus:ring-2 focus:ring-blue-500
              `}
              role="menuitem"
              aria-current={pathname === href ? 'page' : undefined}
              onClick={() => setIsMenuOpen(false)}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
