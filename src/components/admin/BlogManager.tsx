// src/components/admin/BlogManager.tsx
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useBlog } from '@/utils/hooks/useBlog';
import { BlogPost } from '@/utils/blog-operations';

export default function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'draft' | 'published'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { searchPosts, deletePost } = useBlog();
  const router = useRouter();

  useEffect(() => {
    loadPosts();
  }, [selectedStatus]);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const result = await searchPosts({
        status: selectedStatus === 'all' ? undefined : selectedStatus,
        sortBy: 'date',
        sortOrder: 'desc'
      });

      if (result) {
        setPosts(result.posts);
      }
    } catch  {
      setError('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (slug: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await deletePost(slug);
      loadPosts(); // Reload posts after deletion
    } catch {
      setError('Failed to delete post');
    }
  };

  const handleCreatePost = () => {
    router.push('/blog/edit/new');
  };

  if (loading) {
    return <div>Loading posts...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-x-4">
          <h2 className="text-2xl font-bold inline-block mr-4">Blog Posts</h2>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value as typeof selectedStatus)}
            className="px-3 py-1 border rounded-md"
          >
            <option value="all">All Posts</option>
            <option value="draft">Drafts</option>
            <option value="published">Published</option>
          </select>
        </div>
        <button
          onClick={handleCreatePost}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Create New Post
        </button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {posts.map((post) => (
              <tr key={post.slug} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {post.title}
                  </Link>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {post.author}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    post.status === 'published' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {post.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Not published'}
                </td>
                <td className="px-6 py-4 text-sm font-medium space-x-2">
                  <Link
                    href={`/blog/edit/${post.slug}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeletePost(post.slug)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No posts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}