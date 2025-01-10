// src/lib/schema.ts

type Course = {
  title: string;
  description: string;
  provider?: string;
  price?: string;
  language?: string;
  level?: string;
  startDate?: string;
  endDate?: string;
  duration?: string;
  mode?: string; // online, in-person, hybrid
};

type BlogPost = {
  title: string;
  description: string;
  date: string;
  author?: {
    name: string;
    image?: string;
  };
  image?: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type Review = {
  author: string;
  reviewBody: string;
  reviewRating: number;
  datePublished: string;
};

type LocalBusiness = {
  name: string;
  image?: string;
  telephone?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  geo?: {
    latitude: number;
    longitude: number;
  };
  openingHours?: string[];
};

export function generateCourseSchema(course: Course) {
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
    offers: {
      '@type': 'Offer',
      price: course.price?.replace(/[^0-9]/g, ''),
      priceCurrency: 'NOK',
      availability: 'https://schema.org/InStock',
      validFrom: course.startDate,
    },
    courseMode: course.mode,
    educationalLevel: course.level,
    inLanguage: course.language,
    startDate: course.startDate,
    endDate: course.endDate,
    timeRequired: course.duration,
  };
}

export function generateFAQSchema(faqItems: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

export function generateReviewSchema(reviews: Review[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'LanguageSchool',
      name: 'Oslo Languages',
    },
    ratingValue: reviews.reduce((acc, review) => acc + review.reviewRating, 0) / reviews.length,
    reviewCount: reviews.length,
    bestRating: 5,
    worstRating: 1,
    review: reviews.map(review => ({
      '@type': 'Review',
      author: {
        '@type': 'Person',
        name: review.author,
      },
      reviewBody: review.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: review.reviewRating,
      },
      datePublished: review.datePublished,
    })),
  };
}

export function generateLocalBusinessSchema(business: LocalBusiness) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LanguageSchool',
    name: business.name,
    image: business.image,
    telephone: business.telephone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address.street,
      addressLocality: business.address.city,
      postalCode: business.address.postalCode,
      addressCountry: business.address.country,
    },
    ...(business.geo && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: business.geo.latitude,
        longitude: business.geo.longitude,
      },
    }),
    ...(business.openingHours && {
      openingHoursSpecification: business.openingHours.map(hours => ({
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: hours,
      })),
    }),
    '@id': 'https://oslolanguages.com/#organization',
    url: 'https://oslolanguages.com',
    sameAs: [
      'https://www.facebook.com/oslolanguages',
      'https://www.instagram.com/oslolanguages',
      'https://www.linkedin.com/company/oslolanguages',
    ],
  };
}

export function generateBlogPostSchema(post: BlogPost) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    image: post.image ? [post.image] : undefined,
    author: post.author ? {
      '@type': 'Person',
      name: post.author.name,
      image: post.author.image,
    } : undefined,
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
      contactType: 'customer service'
    },
    sameAs: [
      'https://facebook.com/oslolanguages',
      'https://instagram.com/oslolanguages',
      'https://linkedin.com/company/oslolanguages'
    ]
  };
}