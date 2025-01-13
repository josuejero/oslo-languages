// src/components/layout/header/Navigation.tsx
import { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavigationLink {
  href: string;
  label: string;
}

const navigationLinks: NavigationLink[] = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();

  // Track the first and last focusable elements for keyboard navigation
  const [firstFocusable, setFirstFocusable] = useState<HTMLElement | null>(null);
  const [lastFocusable, setLastFocusable] = useState<HTMLElement | null>(null);

  // Update focusable elements when menu opens
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      setFirstFocusable(focusableElements[0]);
      setLastFocusable(focusableElements[focusableElements.length - 1]);

      // Focus first element when menu opens
      focusableElements[0]?.focus();
    }
  }, [isMenuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (!isMenuOpen) return;

    const { key, shiftKey } = event;

    // Close menu on Escape
    if (key === 'Escape') {
      setIsMenuOpen(false);
      buttonRef.current?.focus();
      return;
    }

    // Trap focus within menu
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

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav aria-label="Main navigation" className="relative">
      {/* Skip Link - Hidden until focused */}
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
                : 'text-gray-700 hover:bg-blue-50 hover:text-blue-600'
              }
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            `}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* Mobile Navigation Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
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
            d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
          />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        ref={menuRef}
        onKeyDown={handleKeyDown}
        className={`
          absolute top-full left-0 w-full
          md:hidden
          ${isMenuOpen ? 'block' : 'hidden'}
        `}
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="mobile-menu-button"
      >
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg rounded-md border">
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