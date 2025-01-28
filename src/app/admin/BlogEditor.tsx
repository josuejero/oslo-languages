import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import type { MDEditorProps } from '@uiw/react-md-editor';
import { useForm, Controller } from 'react-hook-form';
import { AlertDialog, AlertDialogContent, AlertDialogTitle } from '@/components/ui/alert';

const MDEditor = dynamic<MDEditorProps>(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface BlogPost {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  categories: string[];
  tags: string[];
  coverImage: string;
  status: 'draft' | 'published';
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
  const [previewMode, setPreviewMode] = useState(false);
  const [showUnsavedChanges, setShowUnsavedChanges] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const { register, handleSubmit, control, watch, reset, formState: { errors } } = useForm<BlogPost>({
    defaultValues: initialData || {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      categories: [],
      tags: [],
      coverImage: '',
      status: 'draft'
    }
  });

  // Watch form values for unsaved changes
  const formValues = watch();
  useEffect(() => {
    if (JSON.stringify(formValues) !== JSON.stringify(initialData)) {
      setIsDirty(true);
    }
  }, [formValues, initialData]);

  // Auto-save draft functionality
  useEffect(() => {
    const saveDraft = async () => {
      if (isDirty && formValues.status === 'draft') {
        try {
          const draftData = { ...formValues, lastSaved: new Date().toISOString() };
          localStorage.setItem('blog_draft', JSON.stringify(draftData));
        } catch (error) {
          console.error('Error saving draft:', error);
        }
      }
    };

    const interval = setInterval(saveDraft, 30000); // Auto-save every 30 seconds
    return () => clearInterval(interval);
  }, [isDirty, formValues]);

  // Load draft if available
  useEffect(() => {
    if (!isEditing) {
      const savedDraft = localStorage.getItem('blog_draft');
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft);
        setShowUnsavedChanges(true);
        reset(draftData);
      }
    }
  }, [isEditing, reset]);

  const onSubmit = async (data: BlogPost, status: 'draft' | 'published' = 'draft') => {
    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        ...data,
        status,
        publishDate: status === 'published' ? new Date().toISOString() : undefined,
      };

      const response = await fetch(
        `/api/admin/posts${isEditing ? `/${initialData?.slug}` : ''}`,
        {
          method: isEditing ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to save post');
      }

      if (status === 'published') {
        localStorage.removeItem('blog_draft');
      }

      router.push('/admin/posts');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate slug from title
  const generateSlug = useCallback((title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
  }, []);

  // Preview mode toggle
  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  return (
    <div className="space-y-8">
      {/* Preview/Edit Mode Toggle */}
      <div className="flex justify-end mb-4">
        <button
          type="button"
          onClick={togglePreview}
          className="px-4 py-2 text-sm bg-accent-primary text-white rounded-md hover:bg-accent-secondary"
        >
          {previewMode ? 'Edit' : 'Preview'}
        </button>
      </div>

      {previewMode ? (
        // Preview Mode
        <div className="prose max-w-none">
          <h1>{formValues.title}</h1>
          <div className="flex gap-2 mb-4">
            {formValues.categories.map((category, index) => (
              <span key={index} className="bg-accent-primary text-white px-2 py-1 rounded-full text-sm">
                {category}
              </span>
            ))}
          </div>
          <div className="mb-8">
            <img
              src={formValues.coverImage || '/placeholder.jpg'}
              alt={formValues.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div dangerouslySetInnerHTML={{ __html: formValues.content }} />
          <div className="mt-4 flex gap-2">
            {formValues.tags.map((tag, index) => (
              <span key={index} className="text-accent-primary">#{tag}</span>
            ))}
          </div>
        </div>
      ) : (
        // Edit Mode
        <form onSubmit={handleSubmit((data) => onSubmit(data))} className="space-y-6">
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-md">
              {error}
            </div>
          )}

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input
              {...register('title', { required: 'Title is required' })}
              className="w-full px-4 py-2 border rounded-md"
              onChange={(e) => {
                register('title').onChange(e);
                register('slug').onChange({
                  target: { value: generateSlug(e.target.value) }
                });
              }}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Slug Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Slug</label>
            <input
              {...register('slug', { required: 'Slug is required' })}
              className="w-full px-4 py-2 border rounded-md bg-gray-50"
              readOnly
            />
          </div>

          {/* Excerpt Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Excerpt</label>
            <textarea
              {...register('excerpt', { required: 'Excerpt is required' })}
              rows={3}
              className="w-full px-4 py-2 border rounded-md"
            />
            {errors.excerpt && (
              <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>
            )}
          </div>

          {/* Categories Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Categories</label>
            <Controller
              name="categories"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value.join(', ')}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Separate categories with commas"
                />
              )}
            />
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <Controller
              name="tags"
              control={control}
              render={({ field }) => (
                <input
                  {...field}
                  value={field.value.join(', ')}
                  onChange={(e) => field.onChange(e.target.value.split(',').map(s => s.trim()))}
                  className="w-full px-4 py-2 border rounded-md"
                  placeholder="Separate tags with commas"
                />
              )}
            />
          </div>

          {/* Cover Image Input */}
          <div>
            <label className="block text-sm font-medium mb-1">Cover Image URL</label>
            <input
              {...register('coverImage')}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium mb-1">Content</label>
            <Controller
              name="content"
              control={control}
              rules={{ required: 'Content is required' }}
              render={({ field }) => (
                <MDEditor
                  value={field.value}
                  onChange={field.onChange}
                  preview="edit"
                  height={400}
                  className="border rounded-md"
                />
              )}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            
            <div className="space-x-4">
              <button
                type="submit"
                onClick={() => onSubmit(formValues, 'draft')}
                disabled={isSubmitting}
                className="px-4 py-2 border border-accent-primary text-accent-primary rounded-md hover:bg-accent-primary hover:text-white"
              >
                Save Draft
              </button>
              <button
                type="submit"
                onClick={() => onSubmit(formValues, 'published')}
                disabled={isSubmitting}
                className="px-4 py-2 bg-accent-primary text-white rounded-md hover:bg-accent-secondary"
              >
                {isSubmitting ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Unsaved Changes Dialog */}
      <AlertDialog open={showUnsavedChanges}>
        <AlertDialogContent>
          <AlertDialogTitle>Unsaved Draft Found</AlertDialogTitle>
          <p>Would you like to restore your unsaved draft?</p>
          <div className="flex justify-end gap-4 mt-4">
            <button
              onClick={() => {
                localStorage.removeItem('blog_draft');
                setShowUnsavedChanges(false);
                reset(initialData);
              }}
              className="px-4 py-2 border rounded-md"
            >
              Discard
            </button>
            <button
              onClick={() => setShowUnsavedChanges(false)}
              className="px-4 py-2 bg-accent-primary text-white rounded-md"
            >
              Restore Draft
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}