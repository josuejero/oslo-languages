// src/app/admin/posts/new/page.tsx
import BlogEditor from '@/app/admin/BlogEditor';

export default function NewBlogPostPage() {
  return (
    <div className="min-h-screen bg-bg-secondary p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-text-primary">Create New Blog Post</h1>
        
        <div className="bg-bg-tertiary p-6 rounded-lg shadow-lg">
          <BlogEditor />
        </div>
      </div>
    </div>
  );
}