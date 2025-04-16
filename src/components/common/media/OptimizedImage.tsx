'use client';

import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { useInView } from 'react-intersection-observer';
import { getPlaceholder, placeholders } from '@/lib/utils/placeholders';

interface OptimizedImageProps
  extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  lowQualityPlaceholder?: string;
  aspectRatio?: number;
  lazyBoundary?: string;
  background?: string;
  className?: string;
  priority?: boolean;
  imageType?: keyof typeof placeholders;
}

export default function OptimizedImage({
  src,
  alt,
  imageType,
  fallbackSrc = '/images/placeholder.jpg',
  lowQualityPlaceholder,
  aspectRatio,
  lazyBoundary = '100px',
  background = 'bg-gray-100',
  className = '',
  priority = false,
  ...props
}: OptimizedImageProps) {
  // 1️⃣ Generate our LQIP via the placeholder system
  const generatedPlaceholder = getPlaceholder(imageType);
  // If the user passed a custom LQIP, use it; otherwise use ours
  const blurDataURL = lowQualityPlaceholder || generatedPlaceholder;

  // 2️⃣ Track real-src loading and errors
  const [currentSrc, setCurrentSrc] = useState<string>(fallbackSrc);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 3️⃣ Only load the real image once it scrolls into view
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: lazyBoundary,
  });

  useEffect(() => {
    if (inView) {
      setCurrentSrc(src);
      setError(false);
      setLoading(true);
    }
  }, [inView, src]);

  // 4️⃣ Compute padding-top for fixed aspect ratio boxes
  const paddingStyle = aspectRatio
    ? { paddingTop: `${(1 / aspectRatio) * 100}%` }
    : undefined;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${background} ${className}`}
      style={paddingStyle}
      data-testid="image-container"
    >
      {inView && (
        <Image
          {...props}
          src={error ? fallbackSrc : currentSrc}
          alt={alt}
          quality={props.quality ?? 75}
          priority={priority}
          placeholder="blur"
          blurDataURL={blurDataURL}
          sizes={
            props.sizes ||
            '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          }
          className={`transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => {
            setLoading(false);
          }}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          data-testid="optimized-image"
        />
      )}

      {/* skeleton while loading */}
      {loading && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          data-testid="image-skeleton"
        />
      )}

      {/* accessibility live regions */}
      <div
        data-testid="loading-status"
        aria-live="polite"
        className="sr-only"
      >
        {loading ? 'loading' : ''}
      </div>
      {error && (
        <div
          data-testid="error-status"
          aria-live="assertive"
          className="sr-only"
        >
          Failed to load image
        </div>
      )}
    </div>
  );
}
