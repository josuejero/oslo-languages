// src/app/admin/BlogEditor.tsx

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { MDEditorProps } from '@uiw/react-md-editor';

const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);
// src/app/admin/BlogEditor.tsx
interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string[];
  coverImage: string;
  status?: 'draft' | 'published'; // Make status optional
  publishDate?: string;
}


interface BlogEditorProps {
  initialData?: BlogPost;
  isEditing?: boolean;
}

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  
  const [formData, setFormData] = useState<BlogPost>(initialData || {
    title: '',
    excerpt: '',
    content: '',
    categories: [],
    tags: [],
    coverImage: '',
    status: 'draft',
  });

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        ...formData,
        status,
        publishDate: status === 'published' ? new Date().toISOString() : undefined,
      };

      const response = await fetch(
        `/api/admin/posts${isEditing ? `/${initialData?.title.toLowerCase().replace(/\s+/g, '-')}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'categories' | 'tags'
  ) => {
    const values = e.target.value.split(',').map(item => item.trim());
    setFormData(prev => ({ ...prev, [field]: values }));
  };

  return (
    <form onSubmit={(e) => handleSubmit(e, formData.status)} className="space-y-6">
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
          className="w-full px-3 py-2 border border-text-secondary rounded-md bg-bg-secondary text-text-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Excerpt
        </label>
        <textarea
          name="excerpt"
          value={formData.excerpt}
          onChange={handleInputChange}
          required
          rows={3}
          className="w-full px-3 py-2 border border-text-secondary rounded-md bg-bg-secondary text-text-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Cover Image
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            name="coverImage"
            value={formData.coverImage}
            onChange={handleInputChange}
            className="flex-1 px-3 py-2 border border-text-secondary rounded-md bg-bg-secondary text-text-primary"
          />
          <button
            type="button"
            onClick={() => setShowMediaLibrary(true)}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary"
          >
            Browse Media
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Categories (comma-separated)
        </label>
        <input
          type="text"
          value={formData.categories.join(', ')}
          onChange={(e) => handleArrayInputChange(e, 'categories')}
          className="w-full px-3 py-2 border border-text-secondary rounded-md bg-bg-secondary text-text-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Tags (comma-separated)
        </label>
        <input
          type="text"
          value={formData.tags.join(', ')}
          onChange={(e) => handleArrayInputChange(e, 'tags')}
          className="w-full px-3 py-2 border border-text-secondary rounded-md bg-bg-secondary text-text-primary"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Content
        </label>
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowMediaLibrary(true)}
            className="absolute top-2 right-2 z-10 px-3 py-1 bg-accent-primary text-white rounded-md hover:bg-accent-secondary text-sm"
          >
            Add Image
          </button>
          <div data-color-mode="dark">
            <MDEditor
              value={formData.content}
              onChange={(value) => setFormData(prev => ({ ...prev, content: value || '' }))}
              preview="edit"
              height={400}
              textareaProps={{
                placeholder: 'Write your content here...',
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-text-secondary rounded-md hover:bg-bg-secondary text-text-primary"
        >
          Cancel
        </button>
        
        <div className="space-x-4">
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e, 'draft');
            }}
            disabled={isSubmitting}
            className="px-4 py-2 border border-accent-primary text-accent-primary rounded-md hover:bg-accent-primary hover:text-white disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            type="submit"
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e, 'published');
            }}
            disabled={isSubmitting}
            className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-bg-tertiary p-6 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-text-primary">Media Library</h2>
              <button
                onClick={() => setShowMediaLibrary(false)}
                className="text-text-secondary hover:text-text-primary"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Media Library content goes here */}
          </div>
        </div>
      )}
    </form>
  );
}