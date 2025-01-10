// src/lib/seo.ts

import { BreadcrumbList } from 'schema-dts';

interface BreadcrumbItem {
  name: string;
  path: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  const breadcrumbSchema: BreadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@id': `${process.env.NEXT_PUBLIC_SITE_URL}${item.path}`,
        name: item.name,
      },
    })),
  };

  return breadcrumbSchema;
}
interface OpenGraphImageOptions {
  title: string;
  description?: string;
  siteName?: string;
  templateImage?: string;
}

export function generateOpenGraphImage(options: OpenGraphImageOptions) {
  // Base URL for your OG image generation endpoint
  const baseUrl = process.env.NEXT_PUBLIC_OG_IMAGE_URL;
  
  if (!baseUrl) return '/images/default-og.jpg';

  const params = new URLSearchParams({
    title: options.title,
    description: options.description || '',
    siteName: options.siteName || 'Oslo Languages',
    template: options.templateImage || 'default',
  });

  return `${baseUrl}?${params.toString()}`;
}

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