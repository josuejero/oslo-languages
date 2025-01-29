import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { generateBlogPostSchema } from '@/lib/schema';
import OptimizedImage from '@/components/OptimizedImage';
import Script from 'next/script';
import { Metadata } from 'next';
import type { BlogPost } from '@/lib/blog';

interface Props {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
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
        images: post.coverImage ? [post.coverImage] : undefined,
      },
      keywords: [...post.categories, ...post.tags].join(',')
    };
  } catch {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found.',
      robots: 'noindex'
    };
  }
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogPostPage({ params }: Props) {
  let post: BlogPost | null;
  
  try {
    post = await getPostBySlug(params.slug);
    if (!post) notFound();
  } catch {
    notFound();
  }

  // Generate structured data for the blog post
  const structuredData = generateBlogPostSchema({
    title: post.title,
    description: post.excerpt,
    datePublished: post.date || '',
    author: {
      name: post.author,
    },
    image: post.coverImage
  });

  return (
    <>
      <Script
        id="blog-post-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      <article className="container mx-auto px-4 py-12">
        {/* Header */}
        <header className="max-w-4xl mx-auto mb-12">
          {post.coverImage && (
            <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
              <OptimizedImage
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
                aspectRatio={16/9}
                sizes="(max-width: 768px) 100vw, 800px"
                background="bg-gray-100"
                lowQualityPlaceholder={`${post.coverImage}?w=20`}
              />
            </div>
          )}

          <h1 className="text-4xl font-bold mb-4 text-text-primary">{post.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-text-secondary mb-6">
            <div className="flex items-center gap-2">
              <span className="font-medium">{post.author}</span>
            </div>

            <time dateTime={post.date || ''}>
              {post.date ? new Date(post.date).toLocaleDateString() : ''}
            </time>
            {post.date && 'lastModified' in post && post.date !== post.lastModified && (
              <span className="text-sm">
                (Updated: {new Date(post.lastModified as string).toLocaleDateString()})
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.categories.map((category) => (
              <Link
                key={category}
                href={`/blog/category/${category.toLowerCase()}`}
                className="bg-accent-primary text-white px-3 py-1 rounded-full hover:bg-accent-secondary transition-colors"
              >
                {category}
              </Link>
            ))}
          </div>

          <p className="text-xl text-text-secondary">{post.excerpt}</p>
        </header>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          <div className="mt-12 pt-6 border-t border-text-secondary">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog/tag/${tag.toLowerCase()}`}
                  className="text-text-secondary hover:text-accent-primary"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="max-w-4xl mx-auto mt-12 flex justify-between">
          <Link
            href="/blog"
            className="text-accent-primary hover:text-accent-secondary transition-colors"
          >
            ← Back to Blog
          </Link>
        </div>
      </article>
    </>
  );
}