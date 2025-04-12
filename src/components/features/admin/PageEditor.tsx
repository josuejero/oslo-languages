
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import MarkdownEditor from "@/components/common/editor/MarkdownEditor";

export interface PageEditorProps {
  pageId: string;
  initialContent?: string;
  onSave?: (content: string) => Promise<void>;
}

export default function PageEditor({
  pageId,
  initialContent = "",
  onSave
}: PageEditorProps) {
  const router = useRouter();
  const [content, setContent] = useState(initialContent);
  const [isLoading, setIsLoading] = useState(!initialContent);
  
  useEffect(() => {
    if (!initialContent) {
      setIsLoading(true);
      
      
      setTimeout(() => {
        setContent("# Welcome to Oslo Languages\n\nWe offer high-quality language courses...");
        setIsLoading(false);
      }, 500);
    }
  }, [initialContent]);
  
  const handleContentChange = (value: string) => {
    setContent(value);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (onSave) {
        await onSave(content);
      } else {
        
        console.log("Saving page content:", content);
      }
      
      router.push("/admin/dashboard");
    } catch (error) {
      console.error("Error saving content:", error);
      
    }
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
            <MarkdownEditor
              id="content"
              value={content}
              onChange={handleContentChange}
              placeholder="Edit page content here..."
              className="min-h-[400px]"
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