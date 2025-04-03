// src/components/layout/Footer.tsx
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="mb-6 md:mb-0">
            <h2 className="text-lg font-semibold mb-2">Oslo Languages</h2>
            <p className="text-gray-300">Quality language education in Oslo</p>
          </div>
          <div>
            <h3 className="text-md font-semibold mb-2">Quick Links</h3>
            <ul className="space-y-1">
              <li><Link href="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link href="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link href="/courses" className="text-gray-300 hover:text-white">Courses</Link></li>
              <li><Link href="/blog" className="text-gray-300 hover:text-white">Blog</Link></li>
              <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
              <li><Link href="/legal" className="text-gray-300 hover:text-white">Legal</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-700 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Oslo Languages. All rights reserved.
        </div>
      </div>
    </footer>
  );
}