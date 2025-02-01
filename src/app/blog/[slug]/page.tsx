// src/app/blog/[slug]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Script from 'next/script';
import { getPostBySlug } from '@/lib/blog/operations';
import BlogPreview from '@/components/blog/BlogPreview';
import { generateBlogPostSchema } from '@/lib/schema';

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const post = await getPostBySlug(params.slug);
    if (!post) return { title: 'Post Not Found' };
    
    return {
      title: post.title,
      description: post.excerpt,
      openGraph: {
        title: post.title,
        description: post.excerpt,
        type: 'article',
        publishedTime: post.publishedAt,
        modifiedTime: post.updatedAt,
        authors: [post.author],
        tags: [...post.categories, ...post.tags],
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    };
  } catch {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
}

export default async function BlogPostPage({ params }: Props) {
  let post;
  
  try {
    post = await getPostBySlug(params.slug);
    if (!post) notFound();
  } catch {
    notFound();
  }

  // Generate structured data
  const structuredData = generateBlogPostSchema({
    title: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt || '',
    author: {
      name: post.author,
    },
    image: post.coverImage,
  });

  return (
    <>
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <div className="container mx-auto px-4 py-12">
        <BlogPreview post={post} />
      </div>
    </>
  );
}