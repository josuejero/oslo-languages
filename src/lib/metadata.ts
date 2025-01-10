// src/lib/metadata.ts
import { Metadata } from 'next';

interface GenerateMetadataProps {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/og-default.jpg',
  noIndex = false,
}: GenerateMetadataProps): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://example.com';

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
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Oslo Languages`,
      description,
      images: [image],
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
    verification: {
      google: 'your-google-verification-code',
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

export const jsonLdScriptProps = {
  type: 'application/ld+json',
  dangerouslySetInnerHTML: {
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LanguageSchool',
      name: 'Oslo Languages',
      description: 'Oslo\'s premier language school offering courses in Norwegian, English, Spanish and more.',
      url: 'https://example.com',
      telephone: '+47-XXX-XX-XXX',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '123 Business Street',
        addressLocality: 'Oslo',
        postalCode: '0123',
        addressCountry: 'NO',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 59.9139,
        longitude: 10.7522,
      },
      openingHours: ['Mo-Fr 09:00-18:00', 'Sa 10:00-16:00'],
      sameAs: [
        'https://www.facebook.com/oslolanguages',
        'https://www.instagram.com/oslolanguages',
        'https://www.linkedin.com/company/oslolanguages',
      ],
    }),
  },
};