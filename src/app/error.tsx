// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/logger';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error('Application error', {
      message: error.message,
      stack: error.stack,
      digest: error.digest,
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="text-center p-8 bg-bg-tertiary rounded-lg shadow-xl max-w-lg">
        <h2 className="text-2xl font-bold text-text-primary mb-4">
          Something went wrong!
        </h2>
        <p className="text-text-secondary mb-6">
          We apologize for the inconvenience. Our team has been notified and is working to fix the issue.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => reset()}
            className="bg-accent-primary text-white px-6 py-2 rounded hover:bg-accent-secondary transition-colors"
          >
            Try again
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="border border-accent-primary text-accent-primary px-6 py-2 rounded hover:bg-bg-secondary transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}