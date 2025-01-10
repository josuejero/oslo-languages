// src/components/OptimizedImage.tsx
'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

type OptimizedImageProps = ImageProps & {
  fallbackSrc?: string;
  lowQualitySrc?: string;
};

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/images/placeholder.jpg',
  lowQualitySrc,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(lowQualitySrc || src);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (lowQualitySrc && !error) {
      const img = new window.Image();
      img.src = typeof src === 'string' ? src : '';
      img.onload = () => {
        setImgSrc(src);
        setLoading(false);
      };
    }
  }, [src, lowQualitySrc, error]);

  return (
    <div className={`relative ${loading ? 'blur-sm' : 'blur-0'} transition-all duration-300`}>
      <Image
        {...props}
        src={error ? fallbackSrc : imgSrc}
        alt={alt}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
        onLoad={() => setLoading(false)}
        quality={90}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        loading="lazy"
        placeholder={lowQualitySrc ? 'blur' : 'empty'}
        blurDataURL={lowQualitySrc}
      />
    </div>
  );
}