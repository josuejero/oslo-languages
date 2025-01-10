'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { MDEditorProps } from '@uiw/react-md-editor';

// Import the MDX editor dynamically to avoid SSR issues
const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);


interface BlogPost {
  title: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string[];
  coverImage: string;
}

interface BlogEditorProps {
  initialData?: BlogPost;
  isEditing?: boolean;
}

export default function BlogEditor({ initialData, isEditing = false }: BlogEditorProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<BlogPost>(initialData || {
    title: '',
    excerpt: '',
    content: '',
    categories: [],
    tags: [],
    coverImage: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/admin/posts${isEditing && initialData ? '/' + initialData.title.toLowerCase().replace(/\s+/g, '-') : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleArrayInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'categories' | 'tags'
  ) => {
    const values = e.target.value.split(',').map((item) => item.trim());
    setFormData((prev) => ({ ...prev, [field]: values }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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
          className="w-full px-3 py-2 border border-text-secondary rounded-md"
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
          className="w-full px-3 py-2 border border-text-secondary rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Cover Image URL
        </label>
        <input
          type="url"
          name="coverImage"
          value={formData.coverImage}
          onChange={handleInputChange}
          className="w-full px-3 py-2 border border-text-secondary rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Categories (comma-separated)
        </label>
        <input
          type="text"
          value={formData.categories.join(', ')}
          onChange={(e) => handleArrayInputChange(e, 'categories')}
          className="w-full px-3 py-2 border border-text-secondary rounded-md"
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
          className="w-full px-3 py-2 border border-text-secondary rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-text-primary mb-2">
          Content
        </label>
        <div data-color-mode="dark">
          <MDEditor
            value={formData.content}
            onChange={(value: string | undefined) => setFormData((prev) => ({ ...prev, content: value || '' }))}
            preview="edit"
            height={400}
            textareaProps={{ placeholder: 'Write your content here...' }}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-text-secondary rounded-md hover:bg-bg-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
        </button>
      </div>
    </form>
  );
}