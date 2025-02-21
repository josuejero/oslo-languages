/**
 * @file Header.tsx
 * @description A redesigned site header with a brand background, 
 * horizontal padding, and a simple nav using Tailwind utilities.
 */

import Link from 'next/link';
import Navigation from './Navigation'; // If you have a separate Navigation component

export default function Header() {
  return (
    // Brand background, text white, 
    // a bit of shadow for visual depth
    <header className="bg-brand text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 flex items-center justify-between">
        {/**
         * Logo / Site Name
         * We can use a simple text-based logo or an actual <img> / <Image /> 
         * component. 
         */}
        <Link
          href="/"
          className="text-2xl font-heading tracking-tight hover:opacity-90 transition-all"
          aria-label="Back to Home"
        >
          Oslo Languages
        </Link>

        {/**
         * Navigation
         * For the step-by-step, we assume "Navigation" is a subcomponent 
         * or we can place inline links. 
         */}
        <Navigation />
      </div>
    </header>
  );
}
