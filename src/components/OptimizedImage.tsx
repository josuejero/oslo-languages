// src/components/OptimizedImage.tsx
import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { useInView } from 'react-intersection-observer';

/**
 * Extended interface for the optimized image component.
 * Note: The "priority" prop is now allowed by no longer omitting it.
 */
interface OptimizedImageProps extends Omit<ImageProps, 'placeholder' | 'blurDataURL'> {
  fallbackSrc?: string;
  lowQualityPlaceholder?: string;
  aspectRatio?: number;
  lazyBoundary?: string;
  background?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  lowQualityPlaceholder,
  aspectRatio,
  lazyBoundary = '100px',
  background = 'bg-gray-100',
  className = '',
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: lazyBoundary
  });

  useEffect(() => {
    try {
      setImgSrc(src);
      setError(false);
      setLoading(true);
    } catch (e) {
      console.error("Error in useEffect updating image state:", e, { src });
    }
  }, [src]);

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
          src={error ? fallbackSrc : imgSrc}
          alt={alt}
          quality={props.quality ?? 75}
          className={`transition-opacity duration-300 ${loading ? 'opacity-0' : 'opacity-100'}`}
          onLoad={() => {
            try {
              setLoading(false);
            } catch (err) {
              console.error("Error in onLoad handler:", err);
            }
          }}
          onError={() => {
            try {
              setError(true);
              setLoading(false);
            } catch (err) {
              console.error("Error in onError handler:", err);
            }
          }}
          placeholder={lowQualityPlaceholder ? 'blur' : 'empty'}
          blurDataURL={lowQualityPlaceholder}
          sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
          data-testid="optimized-image"
        />
      )}
      
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" data-testid="image-skeleton" />
      )}

      <div data-testid="loading-status" aria-live="polite" className="sr-only">
        {loading ? 'loading' : ''}
      </div>
      {error && (
        <div data-testid="error-status" aria-live="assertive" className="sr-only">
          Failed to load image
        </div>
      )}
    </div>
  );
}