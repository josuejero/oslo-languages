// src/components/layout/header/Header.tsx
import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="bg-white shadow-md" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link
              href="/"
              className="text-xl font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Oslo Languages, back to home page"
            >
              Oslo Languages
            </Link>
          </div>

          <Navigation />
        </div>
      </div>
    </header>
  );
}