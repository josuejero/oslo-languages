// src/components/seo/SEO.tsx
import { Metadata } from 'next';
import Script from 'next/script';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
  ogType?: string;
  structuredData?: Record<string, unknown>;
  canonical?: string;
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  keywords = [],
  ogImage,
  ogType = 'website',
  canonical,
  noIndex = false,
}: SEOProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://oslolanguages.com';

  return {
    title: `${title} | Oslo Languages`,
    description,
    keywords: [
      'language school oslo',
      'norwegian courses',
      'english courses',
      'spanish courses',
      ...keywords,
    ],
    authors: [{ name: 'Oslo Languages' }],
    openGraph: {
      title: `${title} | Oslo Languages`,
      description,
      url: baseUrl,
      siteName: 'Oslo Languages',
      images: [
        {
          url: ogImage || '/og-default.jpg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_NO',
      type: ogType as 'website' | 'article' | 'book' | 'profile' | 'music.song' | 'music.album' | 'music.playlist' | 'music.radio_station' | 'video.movie' | 'video.episode' | 'video.tv_show' | 'video.other',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Oslo Languages`,
      description,
      images: [ogImage || '/og-default.jpg'],
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: canonical || baseUrl,
    },
  };
}
export default function SEO({ structuredData }: { structuredData?: Record<string, unknown> }) {
  if (!structuredData) return null;

  return (
    <Script
      id="structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}