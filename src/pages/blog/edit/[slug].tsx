// src/pages/blog/edit/[slug].tsx
"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBlog } from '@/utils/hooks/useBlog';
import dynamic from 'next/dynamic';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BlogPost } from '@/utils/blog';

// Dynamically import BlogEditor to prevent SSR issues
const BlogEditor = dynamic(
  () => import('@/components/blog/BlogEditor'),
  { ssr: false }
);

// Dynamically import BlogPreview to prevent SSR issues
const BlogPreview = dynamic(
  () => import('@/components/blog/BlogPreview'),
  { ssr: false }
);

interface Props {
  params: { slug: string };
}

export default function EditBlogPostPage({ params }: Props) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [previewContent, setPreviewContent] = useState<string>('');
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();
  const { getPost, error } = useBlog();

  // Ensure we're on the client side
  useEffect(() => {
    setIsClient(true);
    
    // Load post data if available
    if (params?.slug && params.slug !== 'new') {
      loadPost();
    }
  }, [params?.slug]);

  const loadPost = async () => {
    if (params?.slug && params.slug !== 'new') {
      const loadedPost = await getPost(params.slug);
      if (loadedPost) {
        setPost(loadedPost);
      }
    }
  };

  const handleSave = (savedPost: BlogPost) => {
    router.push(`/blog/${savedPost.slug}`);
  };

  const handleCancel = () => {
    router.back();
  };

  const handlePreview = (content: string) => {
    setPreviewContent(content);
    setPreviewMode(true);
  };

  // Don't render anything during SSR
  if (!isClient) {
    return null;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          {post ? 'Edit Post' : 'Create New Post'}
        </h1>
        <button
          onClick={() => setPreviewMode(!previewMode)}
          className="px-4 py-2 text-blue-600 hover:text-blue-700"
        >
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      {previewMode ? (
        <BlogPreview
          content={previewContent}
          onPreviewError={() => setPreviewMode(false)}
        />
      ) : (
        <BlogEditor
          post={post || undefined}
          onSave={handleSave}
          onCancel={handleCancel}
          onPreview={handlePreview}
        />
      )}
    </div>
  );
}