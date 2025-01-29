// src/app/blog/page.tsx
import { getAllPosts } from '@/lib/blog';
import BlogList from '@/components/blog/BlogList';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog - Oslo Languages',
  description: 'Read our latest articles about language learning, Norwegian culture, and more.',
};

export default async function BlogPage() {
  const posts = await getAllPosts();
  
  // Extract unique categories and tags from posts
  const categories = [...new Set(posts.flatMap(post => post.categories))];
  const tags = [...new Set(posts.flatMap(post => post.tags))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList 
        initialPosts={posts} 
        categories={categories}
        tags={tags}
      />
    </div>
  );
}