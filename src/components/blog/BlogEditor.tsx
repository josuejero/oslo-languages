// src/components/blog/BlogEditor.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { FormField, Input, Select } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBlog } from '@/utils/hooks/useBlog';
import { BlogPost } from '@/utils/blog';
import OptimizedImage from '@/components/OptimizedImage';

// Dynamically import SimpleMDE editor with SSR disabled
const SimpleMDE = dynamic(
  () => import('react-simplemde-editor').then((mod) => mod.default),
  { ssr: false }
);

interface BlogEditorProps {
  post?: BlogPost;
  onSave: (savedPost: BlogPost) => void;
  onCancel: () => void;
  onPreview: (content: string) => void;
}

type FormData = {
  title: string;
  excerpt: string;
  content: string;
  status: 'draft' | 'published';
  categories: string[];
  tags: string[];
  coverImage?: string;
};

const CATEGORIES = [
  'Norwegian Language',
  'English Language',
  'Spanish Language',
  'Learning Tips',
  'Student Stories',
  'Oslo Life'
];

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' }
];

export default function BlogEditor({ post, onSave, onCancel, onPreview }: BlogEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isMounted, setIsMounted] = useState(false);
  const { loading, error, createPost, updatePost, previewContent } = useBlog();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: post?.title || '',
      excerpt: post?.excerpt || '',
      content: post?.content || '',
      status: post?.status || 'draft',
      categories: post?.categories || [],
      tags: post?.tags || [],
      coverImage: post?.coverImage
    }
  });

  // Ensure component is mounted before rendering SimpleMDE
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Watch content for preview and image for preview
  const content = watch('content');
  const coverImage = watch('coverImage');

  useEffect(() => {
    if (showPreview && content) {
      const generatePreview = async () => {
        const html = await previewContent(content);
        if (html) {
          setPreviewHtml(html);
        }
      };
      generatePreview();
    }
  }, [content, showPreview, previewContent]);

  useEffect(() => {
    if (coverImage) {
      setImagePreview(coverImage);
    }
  }, [coverImage]);

  const onSubmit = async (data: FormData) => {
    const postData = {
      ...data,
      categories: data.categories.filter(Boolean),
      tags: data.tags.filter(Boolean).map(tag => tag.toLowerCase())
    };

    let savedPost: BlogPost | null;
    
    if (post?.slug) {
      savedPost = await updatePost(post.slug, postData);
    } else {
      savedPost = await createPost(postData);
    }

    if (savedPost && onSave) {
      onSave(savedPost);
    }
  };

  const handleContentChange = (value: string) => {
    setValue('content', value);
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setValue('tags', tags);
  };

  // SimpleMDE options
  const editorOptions = {
    autofocus: true,
    spellChecker: false,
    status: ['lines', 'words'],
    minHeight: '400px',
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <FormField
            label="Title"
            error={errors.title?.message}
            required
          >
            <Input
              {...register('title', { required: 'Title is required' })}
              placeholder="Enter post title"
            />
          </FormField>

          <FormField
            label="Excerpt"
            error={errors.excerpt?.message}
            required
          >
            <Input
              {...register('excerpt', { required: 'Excerpt is required' })}
              placeholder="Enter post excerpt"
            />
          </FormField>

          <FormField
            label="Cover Image URL"
            error={errors.coverImage?.message}
          >
            <Input
              {...register('coverImage')}
              placeholder="Enter cover image URL"
            />
            {imagePreview && (
              <div className="mt-2 relative h-40">
                <OptimizedImage
                  src={imagePreview}
                  alt="Cover image preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
          </FormField>

          <FormField
            label="Status"
            error={errors.status?.message}
            required
          >
            <Select
              options={STATUS_OPTIONS}
              {...register('status')}
            />
          </FormField>
        </div>

        <div className="space-y-6">
          <FormField
            label="Categories"
            error={errors.categories?.message}
          >
            <div className="space-y-2">
              {CATEGORIES.map((category) => (
                <label key={category} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={category}
                    {...register('categories')}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>{category}</span>
                </label>
              ))}
            </div>
          </FormField>

          <FormField
            label="Tags"
            error={errors.tags?.message}
          >
            <Input
              {...register('tags')}
              placeholder="Enter tags (comma-separated)"
              onChange={handleTagsChange}
            />
          </FormField>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showPreview ? 'Edit' : 'Preview'}
          </button>
        </div>

        {showPreview ? (
          <div 
            className="prose max-w-none p-4 border rounded-md bg-white"
            dangerouslySetInnerHTML={{ __html: previewHtml }}
          />
        ) : (
          // Only render SimpleMDE when component is mounted client-side
          isMounted && (
            <>
              {/* Import CSS for SimpleMDE here to avoid server-side import */}
              <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/easymde/dist/easymde.min.css" />
              <SimpleMDE
                value={content}
                onChange={handleContentChange}
                options={editorOptions}
              />
            </>
          )
        )}
      </div>

      <div className="flex justify-end space-x-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? 'Saving...' : 'Save Post'}
        </button>
      </div>
    </form>
  );
}