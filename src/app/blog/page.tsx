// src/app/blog/page.tsx
import Image from 'next/image';
import Link from 'next/link';
import { getAllPosts } from '@/lib/blog';
import type { Metadata } from 'next';
import BlogList from '@/components/widgets/BlogList';


export const metadata: Metadata = {
  title: 'Blog - Oslo Languages',
  description: 'Read our latest articles about language learning, Norwegian culture, and more.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-text-primary">Blog</h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post) => (
          <article key={post.slug} className="bg-bg-secondary rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
            {post.coverImage && (
              <div className="relative h-48">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            
            <div className="p-6">
              <div className="flex flex-wrap gap-2 mb-3">
                {post.categories.map((category) => (
                  <Link
                    key={category}
                    href={`/blog/category/${category.toLowerCase()}`}
                    className="text-sm bg-accent-primary text-white px-2 py-1 rounded-full hover:bg-accent-secondary transition-colors"
                  >
                    {category}
                  </Link>
                ))}
              </div>

              <h2 className="text-xl font-bold mb-2 text-text-primary">
                <Link href={`/blog/${post.slug}`} className="hover:text-accent-primary">
                  {post.title}
                </Link>
              </h2>

              <p className="text-text-secondary mb-4">{post.excerpt}</p>

              <div className="flex items-center justify-between text-sm text-text-secondary">
                <span>{post.author}</span>
                <time dateTime={post.date}>
                  {new Date(post.date).toLocaleDateString()}
                </time>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Link
                    key={tag}
                    href={`/blog/tag/${tag.toLowerCase()}`}
                    className="text-sm text-text-secondary hover:text-accent-primary"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
      <BlogList posts={posts} />
    </div>
  );
}