// src/app/admin/posts/page.tsx
import { getAllPosts } from '@/lib/blog';
import Link from 'next/link';

export default async function BlogManagementPage() {
  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-bg-secondary p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary">Manage Blog Posts</h1>
          <Link
            href="/admin/posts/new"
            className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-secondary"
          >
            Create New Post
          </Link>
        </div>

        <div className="bg-bg-tertiary rounded-lg shadow-lg overflow-hidden">
          <table className="w-full">
            <thead className="bg-bg-secondary">
              <tr>
                <th className="px-6 py-3 text-left text-text-primary">Title</th>
                <th className="px-6 py-3 text-left text-text-primary">Author</th>
                <th className="px-6 py-3 text-left text-text-primary">Date</th>
                <th className="px-6 py-3 text-left text-text-primary">Categories</th>
                <th className="px-6 py-3 text-right text-text-primary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-text-secondary">
              {posts.map((post) => (
                <tr key={post.slug} className="hover:bg-bg-secondary">
                  <td className="px-6 py-4 text-text-primary">{post.title}</td>
                  <td className="px-6 py-4 text-text-secondary">{post.author}</td>
                  <td className="px-6 py-4 text-text-secondary">
                    {new Date(post.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {post.categories.map((category) => (
                        <span
                          key={category}
                          className="bg-accent-primary text-white px-2 py-1 rounded-full text-sm"
                        >
                          {category}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-2">
                    <Link
                      href={`/admin/posts/${post.slug}/edit`}
                      className="text-accent-primary hover:text-accent-secondary"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={async () => {
                        if (confirm('Are you sure you want to delete this post?')) {
                          await fetch(`/api/admin/posts/${post.slug}`, {
                            method: 'DELETE',
                          });
                          window.location.reload();
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}