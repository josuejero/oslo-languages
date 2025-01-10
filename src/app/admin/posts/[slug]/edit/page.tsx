// src/app/admin/posts/[slug]/edit/page.tsx
import { notFound } from 'next/navigation';
import BlogEditor from '@/app/admin/BlogEditor';
import { getPostBySlug } from '@/lib/blog';

interface Props {
  params: { slug: string };
}

export default async function EditBlogPostPage({ params }: Props) {
  let post;
  try {
    post = await getPostBySlug(params.slug);
    if (!post) {
      notFound();
    }
  } catch (error) {
    console.error('Error fetching post:', error);
    notFound();
  }

  return (
    <div className="min-h-screen bg-bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-text-primary">
          Edit Blog Post: {post.title}
        </h1>
        
        <div className="bg-bg-tertiary p-6 rounded-lg shadow-lg">
          <BlogEditor 
            initialData={{
              title: post.title,
              excerpt: post.excerpt,
              content: post.content,
              categories: post.categories,
              tags: post.tags,
              coverImage: post.coverImage,
            }} 
            isEditing={true} 
          />
        </div>
      </div>
    </div>
  );
}