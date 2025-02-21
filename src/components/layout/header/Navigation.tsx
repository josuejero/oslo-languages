/**
 * @file Navigation.tsx
 * @description Provides the primary site navigation bar, including both desktop and mobile variants.
 * Incorporates accessibility features like skip links, keyboard-trapping within the mobile menu,
 * and ARIA attributes for clarity.
 */

import { useRef, useEffect, useState, KeyboardEvent } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * @interface NavigationLink
 * Represents a single link in the navigation bar.
 */
interface NavigationLink {
  href: string;
  label: string;
}

/**
 * @constant navigationLinks
 * Defines the top-level navigation items used throughout the site.
 */
const navigationLinks: NavigationLink[] = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' }
];

/**
 * @function Navigation
 * Renders both desktop and mobile navigation, managing open/close states
 * and focus management to facilitate keyboard accessibility.
 *
 * @returns JSX.Element
 */
export default function Navigation(): JSX.Element {
  // Manages whether the mobile menu is open or closed
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // References for the menu container and the mobile toggle button
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Track the first and last focusable elements for keyboard navigation
  const [firstFocusable, setFirstFocusable] = useState<HTMLElement | null>(null);
  const [lastFocusable, setLastFocusable] = useState<HTMLElement | null>(null);

  // Get current path to highlight active navigation link
  const pathname = usePathname();

  /**
   * Effect: When the mobile menu opens, find all focusable elements and
   * set the first one to receive immediate focus for keyboard users.
   */
  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), ' +
        'select:not([disabled]), textarea:not([disabled]), ' +
        '[tabindex]:not([tabindex="-1"])'
      );

      setFirstFocusable(focusableElements[0] || null);
      setLastFocusable(focusableElements[focusableElements.length - 1] || null);

      // Focus the first focusable element in the menu
      focusableElements[0]?.focus();
    }
  }, [isMenuOpen]);

  /**
   * @function handleKeyDown
   * Manages keyboard interactions within the mobile menu:
   * - Close the menu upon pressing Escape.
   * - Trap focus within the menu when using Tab.
   *
   * @param {KeyboardEvent} event - The keyboard event object.
   */
  const handleKeyDown = (event: KeyboardEvent) => {
    if (!isMenuOpen) return;

    const { key, shiftKey } = event;

    // Close menu on Escape key
    if (key === 'Escape') {
      setIsMenuOpen(false);
      buttonRef.current?.focus();
      return;
    }

    // Trap focus inside the mobile menu
    if (key === 'Tab') {
      if (!firstFocusable || !lastFocusable) return;

      // If Shift+Tab on first element, move to last
      if (shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
      // If Tab on last element, move to first
      else if (!shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  };

  /**
   * Effect: Close the mobile menu if the user clicks outside the menu area.
   */
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <nav aria-label="Main navigation" className="relative">
      {/**
       * Skip Link:
       * Allows keyboard users to jump directly to the main content,
       * bypassing repeated navigation elements.
       */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white text-blue-600 p-2 z-50"
      >
        Skip to main content
      </a>

      {/* Desktop Navigation - visible on medium screens and above */}
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

      {/**
       * Mobile Navigation Toggle:
       * Shown only on smaller screens. Toggles the mobile nav menu state.
       */}
      <button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-expanded={isMenuOpen}
        aria-controls="mobile-menu"
        aria-label={isMenuOpen ? 'Close main menu' : 'Open main menu'}
      >
        <span className="sr-only">
          {isMenuOpen ? 'Close main menu' : 'Open main menu'}
        </span>
        {/* Menu icon changes to X when menu is open */}
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

      {/**
       * Mobile Menu Container:
       * Revealed when `isMenuOpen` is true. Contains a vertical list of nav links.
       */}
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
