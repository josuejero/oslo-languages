
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/common/editor/MarkdownEditor";

export default function BlogPostEditor() {
  
  const router = useRouter();
  const [postId, setPostId] = useState<string>("");
  const [action, setAction] = useState<string>("edit"); 
  
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  
  useEffect(() => {
    
    const path = window.location.pathname;
    const segments = path.split('/');
    const id = segments[segments.length - 1];
    const actionType = segments[segments.length - 2];
    
    setPostId(id);
    setAction(actionType);
    
    
    setIsLoading(true);
    
    if (actionType === "edit") {
      
      setTimeout(() => {
        setTitle("Sample Blog Post");
        setContent("# Welcome to Oslo Languages\n\nThis is a sample blog post content...");
        setCategory("Norwegian");
        setIsLoading(false);
      }, 500);
    } else {
      
      setIsLoading(false);
    }
  }, []);
  
  const handleContentChange = (value: string) => {
    setContent(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log("Saving blog post:", { title, content, category });
    router.push("/admin/dashboard");
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">
        {action === "edit" ? "Edit" : "Create"} Blog Post
      </h1>
      
      {isLoading ? (
        <div className="p-4 text-center">Loading content...</div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="mb-6">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Post Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Select a category</option>
              <option value="Norwegian">Norwegian</option>
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="School News">School News</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Post Content
            </label>
            <MarkdownEditor
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="Write your blog post content here..."
            />
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
              {action === "edit" ? "Update" : "Publish"} Post
            </button>
          </div>
        </form>
      )}
    </div>
  );
}