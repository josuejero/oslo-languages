// src/lib/structured-data.ts

interface CourseStructuredData {
  title: string;
  description: string;
  provider?: string;
  price?: string;
  startDate?: string;
  endDate?: string;
  level?: string;
  language?: string;
}

interface BlogPostStructuredData {
  title: string;
  description: string;
  datePublished: string;
  author: {
    name: string;
    image?: string;
  };
  image?: string;
}

interface FAQStructuredData {
  questions: Array<{
    question: string;
    answer: string;
  }>;
}

export function generateCourseSchema(course: CourseStructuredData) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: course.provider || 'Oslo Languages',
      sameAs: 'https://oslolanguages.com'
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
  };
}

export function generateBlogPostSchema(post: BlogPostStructuredData) {
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
        url: 'https://oslolanguages.com/logo.png'
      }
    }
  };
}

export function generateFAQSchema(data: FAQStructuredData) {
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

export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LanguageSchool',
    name: 'Oslo Languages',
    description: 'Premier language school in Oslo offering courses in Norwegian, English, and Spanish.',
    url: 'https://oslolanguages.com',
    logo: 'https://oslolanguages.com/logo.png',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '123 Street Name',
      addressLocality: 'Oslo',
      postalCode: '0123',
      addressCountry: 'NO'
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '59.9139',
      longitude: '10.7522'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+47-XXX-XXX',
      contactType: 'customer service',
      availableLanguage: ['Norwegian', 'English', 'Spanish']
    },
    sameAs: [
      'https://facebook.com/oslolanguages',
      'https://instagram.com/oslolanguages',
      'https://linkedin.com/company/oslolanguages'
    ]
  };
}

export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    }))
  };
}