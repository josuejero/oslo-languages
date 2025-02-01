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
  
  // Convert posts to match the expected Partial<BlogPost> type
  const convertedPosts = posts.map(post => ({
    ...post,
    // Ensure readingTime is a string
    readingTime: typeof post.readingTime === 'string' 
      ? post.readingTime 
      : typeof post.readingTime === 'number'
        ? `${post.readingTime} min read`
        : undefined
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Blog</h1>
      <BlogList 
        initialPosts={convertedPosts}
      />
    </div>
  );
}