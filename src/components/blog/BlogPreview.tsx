// src/components/blog/BlogPreview.tsx
'use client';

import { useEffect, useState } from 'react';
import { BlogPost } from '@/lib/blog/operations';
import OptimizedImage from '@/components/OptimizedImage';
import { useBlog } from '@/lib/hooks/useBlog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BlogPreviewProps {
  post?: BlogPost;
  content?: string;
  onPreviewError?: (error: string) => void;
}

export default function BlogPreview({ post, content, onPreviewError }: BlogPreviewProps) {
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const { previewContent, error } = useBlog();

  useEffect(() => {
    if (content) {
      generatePreview();
    } else if (post) {
      setPreviewHtml(post.content);
    }
  }, [content, post]); 

  const generatePreview = async () => {
    if (!content) return;

    const html = await previewContent(content);
    if (html) {
      setPreviewHtml(html);
    } else if (error && onPreviewError) {
      onPreviewError(error);
    }
  };

  if (!post && !content) {
    return null;
  }

  return (
    <article className="max-w-4xl mx-auto">
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {post?.coverImage && (
        <div className="relative h-[400px] mb-8 rounded-lg overflow-hidden">
          <OptimizedImage
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
            aspectRatio={16/9}
            sizes="(max-width: 768px) 100vw, 800px"
          />
        </div>
      )}

      {post && (
        <>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-6">
            <span>{post.author}</span>
            {post.publishedAt && (
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString()}
              </time>
            )}
            {post.readingTime && (
              <><span>·</span><span>{post.readingTime}</span></>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.categories.map((category) => (
              <span
                key={category}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {category}
              </span>
            ))}
          </div>
        </>
      )}

      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: previewHtml }}
      />

      {post && (
        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-gray-600 hover:text-blue-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}