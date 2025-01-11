// src/lib/schema.ts

import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://oslolanguages.com';

// Common Types
interface MetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  noIndex?: boolean;
}

interface BreadcrumbItem {
  name: string;
  path: string;
}

interface SchemaAuthor {
  name: string;
  image?: string;
}

interface SchemaAddress {
  street: string;
  city: string;
  postalCode: string;
  country: string;
}

interface SchemaGeo {
  latitude: number;
  longitude: number;
}

// Specific Schema Types
interface CourseSchema {
  title: string;
  description: string;
  provider?: string;
  price?: string;
  startDate?: string;
  endDate?: string;
  level?: string;
  language?: string;
  mode?: 'online' | 'in-person' | 'hybrid';
}

interface BlogPostSchema {
  title: string;
  description: string;
  datePublished: string;
  author: SchemaAuthor;
  image?: string;
}

interface FAQSchema {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

interface OrganizationSchema {
  name: string;
  description?: string;
  image?: string;
  telephone?: string;
  address: SchemaAddress;
  geo?: SchemaGeo;
  openingHours?: string[];
}

// Schema Generators
export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/og-default.jpg',
  noIndex = false,
}: MetadataOptions): Metadata {
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
      url: SITE_URL,
      siteName: 'Oslo Languages',
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: title,
      }],
      locale: 'en_NO',
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
    alternates: {
      canonical: SITE_URL,
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
    },
  };
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `${SITE_URL}${item.path}`,
        name: item.name,
      },
    })),
  };
}

export function generateCourseSchema(course: CourseSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider || 'Oslo Languages',
      sameAs: SITE_URL
    },
    ...(course.price && {
      offers: {
        '@type': 'Offer',
        price: course.price.replace(/[^0-9]/g, ''),
        priceCurrency: 'NOK',
        availability: 'https://schema.org/InStock',
      }
    }),
    ...(course.startDate && { startDate: course.startDate }),
    ...(course.endDate && { endDate: course.endDate }),
    ...(course.level && { educationalLevel: course.level }),
    ...(course.language && { inLanguage: course.language }),
    ...(course.mode && { courseMode: course.mode }),
  };
}

export function generateBlogPostSchema(post: BlogPostSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.datePublished,
    image: post.image ? [post.image] : undefined,
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.image && { image: post.author.image }),
    },
    publisher: {
      '@type': 'Organization',
      name: 'Oslo Languages',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`
      }
    }
  };
}

export function generateFAQSchema(data: FAQSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(({ question, answer }) => ({
      '@type': 'Question',
      name: question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: answer
      }
    }))
  };
}

export function generateOrganizationSchema(data: OrganizationSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LanguageSchool',
    name: data.name,
    description: data.description || 'Premier language school in Oslo offering courses in Norwegian, English, and Spanish.',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: data.address.street,
      addressLocality: data.address.city,
      postalCode: data.address.postalCode,
      addressCountry: data.address.country
    },
    ...(data.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: data.geo.latitude,
        longitude: data.geo.longitude
      }
    }),
    ...(data.telephone && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: data.telephone,
        contactType: 'customer service',
        availableLanguage: ['Norwegian', 'English', 'Spanish']
      }
    }),
    ...(data.openingHours && {
      openingHoursSpecification: data.openingHours.map(hours => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours
      }))
    }),
    sameAs: [
      'https://facebook.com/oslolanguages',
      'https://instagram.com/oslolanguages',
      'https://linkedin.com/company/oslolanguages'
    ]
  };
}

// Helper function for generating default metadata with breadcrumbs
export function generateDefaultMetadata(path: string) {
  const segments = path.split('/').filter(Boolean);
  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    return {
      name: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path,
    };
  });

  return {
    breadcrumbs: generateBreadcrumbSchema([
      { name: 'Home', path: '/' },
      ...breadcrumbs,
    ]),
  };
}