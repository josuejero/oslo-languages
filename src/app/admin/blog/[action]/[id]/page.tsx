// src/app/admin/blog/[action]/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import a markdown editor
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

type PageProps = {
  params: {
    action: string;
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function BlogEditor({ params }: PageProps) {
  const router = useRouter();
  const isNewPost = params.action === "new";
  
  const [post, setPost] = useState({
    title: "",
    category: "Norwegian",
    excerpt: "",
    content: "",
    imageUrl: "/images/blog/default.jpg"
  });
  
  useEffect(() => {
    // In a real app, you would fetch the post data from an API
    if (!isNewPost && params.id) {
      // This is just mock data for demonstration
      setPost({
        title: "5 Tips to Improve Your Norwegian Pronunciation",
        category: "Norwegian",
        excerpt: "Master the unique sounds of Norwegian with these effective pronunciation techniques.",
        content: "# 5 Tips to Improve Your Norwegian Pronunciation\n\nLearning to pronounce Norwegian correctly can be challenging...",
        imageUrl: "/images/blog/pronunciation.jpg"
      });
    }
  }, [isNewPost, params.id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };
  
  const handleContentChange = (value: string) => {
    setPost({ ...post, content: value });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you would send the data to an API
    console.log("Saving post:", post);
    
    // Redirect back to the admin dashboard
    router.push("/admin/dashboard");
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">
        {isNewPost ? "Create New Blog Post" : "Edit Blog Post"}
      </h1>
      
      <form onSubmit={handleSubmit} className="max-w-4xl">
        <div className="mb-6">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={post.title}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={post.category}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="Norwegian">Norwegian</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="School News">School News</option>
          </select>
        </div>
        
        <div className="mb-6">
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 mb-1">
            Excerpt
          </label>
          <textarea
            id="excerpt"
            name="excerpt"
            value={post.excerpt}
            onChange={handleChange}
            rows={3}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          ></textarea>
        </div>
        
        <div className="mb-6">
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
            Feature Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={post.imageUrl}
            onChange={handleChange}
            className="w-full p-3 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          {/* This would use a markdown editor in production */}
          {typeof window !== 'undefined' && (
            <SimpleMDE 
              value={post.content} 
              onChange={handleContentChange}
              options={{
                autofocus: true,
                spellChecker: true,
                placeholder: "Write your blog post content here...",
              }}
            />
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {isNewPost ? "Create Post" : "Update Post"}
          </button>
        </div>
      </form>
    </div>
  );
}