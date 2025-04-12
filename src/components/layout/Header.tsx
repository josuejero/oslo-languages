
import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {}
        <Link
          href="/"
          className="text-2xl font-bold tracking-tight hover:opacity-90 transition-all"
          aria-label="Oslo Languages"
        >
          Oslo Languages
        </Link>

        {}
        <Navigation />
      </div>
    </header>
  );
}