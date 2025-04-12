import { Metadata } from 'next';

interface MetadataOptions {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  canonical?: string;
  noIndex?: boolean;
  locale?: string;
  author?: string;
  twitterSite?: string;
  twitterCreator?: string;
  article?: {
    publishedTime: string;
    modifiedTime?: string;
    authors?: string[];
    tags?: string[];
  };
}

export function generateMetadata({
  title,
  description,
  keywords = [],
  image = '/images/default-image.jpg',
  canonical,
  noIndex = false,
  locale = 'en_US',
  author,
  twitterSite,
  twitterCreator,
  article,
}: MetadataOptions): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://oslolanguages.no';
  const fullImageUrl = image.startsWith('http') ? image : `${siteUrl}${image}`;

  const metadata: Metadata = {
    title: `${title} | Oslo Languages`,
    description,
    openGraph: {
      title: `${title} | Oslo Languages`,
      description,
      images: [
        {
          url: fullImageUrl,
          alt: title,
        },
      ],
      type: article ? 'article' : 'website',
      siteName: 'Oslo Languages',
      locale,
      ...(article && {
        article: {
          publishedTime: article.publishedTime,
          modifiedTime: article.modifiedTime,
          authors: article.authors,
          tags: article.tags,
        },
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Oslo Languages`,
      description,
      images: [fullImageUrl],
      ...(twitterSite && { site: twitterSite }),
      ...(twitterCreator && { creator: twitterCreator }),
    },
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
  };

  if (keywords.length > 0) {
    metadata.keywords = keywords.join(', ');
  }

  if (author) {
    metadata.authors = [{ name: author }];
  }

  if (noIndex) {
    metadata.robots = 'noindex, nofollow';
  }

  return metadata;
}
