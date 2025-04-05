// src/utils/schema.ts
import { Metadata } from 'next';

interface MetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

/**
 * Generates consistent metadata for pages with proper formatting
 */
export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/images/og-default.jpg',
  noIndex = false
}: MetadataOptions): Metadata {
  // Base metadata object
  const metadata: Metadata = {
    title: `${title} | Oslo Languages`,
    description,
    openGraph: {
      title: `${title} | Oslo Languages`,
      description,
      images: [{ url: image }],
      type: 'website',
      siteName: 'Oslo Languages',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Oslo Languages`,
      description,
      images: [image],
    }
  };

  // Add keywords if provided
  if (keywords.length > 0) {
    metadata.keywords = keywords.join(', ');
  }

  // Prevent indexing if needed
  if (noIndex) {
    metadata.robots = 'noindex, nofollow';
  }

  return metadata;
}