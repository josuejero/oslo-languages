// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="text-center p-8 bg-bg-tertiary rounded-lg shadow-xl max-w-lg">
        <h1 className="text-4xl font-bold text-text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-text-primary mb-4">
          Page Not Found
        </h2>
        <p className="text-text-secondary mb-6">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="space-x-4">
          <Link 
            href="/"
            className="bg-accent-primary text-white px-6 py-2 rounded hover:bg-accent-secondary transition-colors inline-block"
          >
            Go Home
          </Link>
          <Link
            href="/contact"
            className="border border-accent-primary text-accent-primary px-6 py-2 rounded hover:bg-bg-secondary transition-colors inline-block"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}