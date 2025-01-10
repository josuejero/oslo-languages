// src/app/admin/dashboard/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/admin/login');
  }

  return (
    <div className="min-h-screen bg-bg-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Admin Dashboard</h1>
          <p className="text-text-secondary">
            Welcome back, {session.user?.email}
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Blog Posts Management */}
          <div className="bg-bg-tertiary p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              Blog Posts
            </h2>
            <p className="text-text-secondary mb-4">
              Manage your blog posts, create new content, and edit existing articles.
            </p>
            <a
              href="/admin/posts"
              className="inline-block bg-accent-primary text-white px-4 py-2 rounded hover:bg-accent-secondary transition-colors"
            >
              Manage Posts
            </a>
          </div>

          {/* Course Management */}
          <div className="bg-bg-tertiary p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              Courses
            </h2>
            <p className="text-text-secondary mb-4">
              Update course information, schedules, and pricing.
            </p>
            <a
              href="/admin/courses"
              className="inline-block bg-accent-primary text-white px-4 py-2 rounded hover:bg-accent-secondary transition-colors"
            >
              Manage Courses
            </a>
          </div>

          {/* Media Library */}
          <div className="bg-bg-tertiary p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">
              Media Library
            </h2>
            <p className="text-text-secondary mb-4">
              Upload and manage images and other media files.
            </p>
            <a
              href="/admin/media"
              className="inline-block bg-accent-primary text-white px-4 py-2 rounded hover:bg-accent-secondary transition-colors"
            >
              Media Library
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}