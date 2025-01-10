// src/components/layout/header/Header.tsx

'use client'

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        buttonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen) {
      const focusableElements = menuRef.current?.querySelectorAll(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (focusableElements && focusableElements.length > 0) {
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        };

        document.addEventListener('keydown', handleTabKey);
        return () => document.removeEventListener('keydown', handleTabKey);
      }
    }
  }, [isMenuOpen]);

  return (
    <header className="bg-bg-secondary shadow-md" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-xl font-bold text-text-primary" aria-label="Oslo Languages, go to home page">
              Oslo Languages
            </Link>
          </div>

          <button
            ref={buttonRef}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-text-primary hover:bg-bg-tertiary"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            aria-label={isMenuOpen ? "Close main menu" : "Open main menu"}
          >
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

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4" role="navigation" aria-label="Main navigation">
            <Link href="/" className="text-text-primary hover:text-accent-primary" aria-current={typeof window !== 'undefined' && window.location.pathname === '/' ? 'page' : undefined}>
              Home
            </Link>
            <Link href="/courses" className="text-text-primary hover:text-accent-primary" aria-current={typeof window !== 'undefined' && window.location.pathname === '/courses' ? 'page' : undefined}>
              Courses
            </Link>
            <Link href="/about" className="text-text-primary hover:text-accent-primary" aria-current={typeof window !== 'undefined' && window.location.pathname === '/about' ? 'page' : undefined}>
              About
            </Link>
            <Link href="/contact" className="text-text-primary hover:text-accent-primary" aria-current={typeof window !== 'undefined' && window.location.pathname === '/contact' ? 'page' : undefined}>
              Contact
            </Link>
          </nav>
        </div>

        {/* Mobile Navigation */}
        <div 
          ref={menuRef}
          id="mobile-menu"
          className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
          role="navigation"
          aria-label="Mobile navigation"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block text-text-primary hover:text-accent-primary py-2" aria-current={typeof window !== 'undefined' && window.location.pathname === '/' ? 'page' : undefined}>
              Home
            </Link>
            <Link href="/courses" className="block text-text-primary hover:text-accent-primary py-2" aria-current={typeof window !== 'undefined' && window.location.pathname === '/courses' ? 'page' : undefined}>
              Courses
            </Link>
            <Link href="/about" className="block text-text-primary hover:text-accent-primary py-2" aria-current={typeof window !== 'undefined' && window.location.pathname === '/about' ? 'page' : undefined}>
              About
            </Link>
            <Link href="/contact" className="block text-text-primary hover:text-accent-primary py-2" aria-current={typeof window !== 'undefined' && window.location.pathname === '/contact' ? 'page' : undefined}>
              Contact
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;