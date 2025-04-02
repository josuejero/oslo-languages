// src/pages/admin/dashboard/index.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/ui';
import { logger } from '@/utils/logger';

export default function AdminDashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blog');
  const router = useRouter();

  // Check auth status on page load
  useEffect(() => {
    // Simple client-side auth check
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/check-auth');
        if (!res.ok) {
          router.push('/admin/login');
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        logger.error('Admin auth check failed', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
    } catch (error) {
      logger.error('Logout error', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
          Logout
        </button>
      </div>
      
      {/* Simple tab navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab('blog')}
            className={`mr-8 py-4 px-1 ${
              activeTab === 'blog'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`mr-8 py-4 px-1 ${
              activeTab === 'content'
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Page Content
          </button>
        </nav>
      </div>
      
      {/* Blog management tab */}
      {activeTab === 'blog' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Blog Posts</h2>
            <Link
              href="/blog/edit/new"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              New Post
            </Link>
          </div>
          
          {/* Simple blog post list */}
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {/* We'll fetch real posts in a useEffect hook in a real implementation */}
              <li>
                <div className="px-4 py-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">Example Blog Post</h3>
                    <p className="text-sm text-gray-500">Published on 2023-01-01</p>
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      href="/blog/edit/example-post"
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </Link>
                    <button className="text-red-600 hover:text-red-800">
                      Delete
                    </button>
                  </div>
                </div>
              </li>
              {/* More posts would be listed here */}
            </ul>
          </div>
        </div>
      )}
      
      {/* Content management tab */}
      {activeTab === 'content' && (
        <div>
          <h2 className="text-xl font-bold mb-4">Page Content</h2>
          
          {/* Simple content editing form */}
          <div className="bg-white shadow overflow-hidden sm:rounded-lg p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Page
              </label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>Home</option>
                <option>About</option>
                <option>Courses</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Content
              </label>
              <textarea
                rows={6}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              ></textarea>
            </div>
            
            <div>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}