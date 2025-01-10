import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';
import { useInView } from 'react-intersection-observer';

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
  
  // Use intersection observer for better lazy loading
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: lazyBoundary
  });

  useEffect(() => {
    setImgSrc(src);
    setError(false);
    setLoading(true);
  }, [src]);

  // Calculate padding based on aspect ratio
  const paddingStyle = aspectRatio 
    ? { paddingTop: `${(1 / aspectRatio) * 100}%` }
    : undefined;

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${background} ${className}`}
      style={paddingStyle}
    >
      {inView && (
        <Image
          {...props}
          src={error ? fallbackSrc : imgSrc}
          alt={alt}
          className={`transition-opacity duration-300 ${
            loading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError(true);
            setLoading(false);
          }}
          placeholder={lowQualityPlaceholder ? 'blur' : 'empty'}
          blurDataURL={lowQualityPlaceholder}
          sizes={props.sizes || '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'}
        />
      )}
      
      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
}