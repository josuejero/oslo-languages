// src/app/admin/pages/edit/[pageId]/editor-client.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

// Dynamically import the markdown editor to prevent SSR issues
const SimpleMDE = dynamic(() => import("react-simplemde-editor"), { ssr: false });

interface EditorClientProps {
  pageId: string;
}

export default function EditorClient({ pageId }: EditorClientProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    setIsLoading(true);
    
    // Mock data for demonstration
    // In a real implementation, fetch the content based on pageId
    setTimeout(() => {
      setContent("# Welcome to Oslo Languages\n\nWe offer high-quality language courses...");
      setIsLoading(false);
    }, 500);
  }, [pageId]);
  
  const handleContentChange = (value: string) => {
    setContent(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Add actual implementation to save content
    console.log("Saving page content:", content);
    router.push("/admin/dashboard");
  };
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">
        Edit {pageId.charAt(0).toUpperCase() + pageId.slice(1)} Page
      </h1>
      
      {isLoading ? (
        <div className="p-4 text-center">Loading content...</div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-4xl">
          <div className="mb-6">
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
              Page Content
            </label>
            <SimpleMDE 
              value={content} 
              onChange={handleContentChange}
              options={{
                autofocus: true,
                spellChecker: true,
              }}
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
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}