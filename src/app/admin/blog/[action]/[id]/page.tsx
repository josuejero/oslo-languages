"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function PageEditor() {
  // Grab the dynamic route parameter ("pageId") via the useParams hook
  const { pageId } = useParams() as { pageId: string };
  const router = useRouter();

  // Local state for your page data
  const [pageData, setPageData] = useState({
    title: "",
    content: "",
  });

  // Example side effect: fetch or initialize data based on pageId
  useEffect(() => {
    if (pageId) {
      // In a real app, you'd fetch from an API or database
      setPageData({
        title: "Sample Page Title",
        content: "Lorem ipsum dolor sit amet...",
      });
    }
  }, [pageId]);

  // Example submit handler
  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log("Saving data for page:", pageId, pageData);
    // In a real app, you'd POST or PUT to your API here

    // Navigate back to an admin dashboard, for example
    router.push("/admin/dashboard");
  };

  // Generic change handler
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setPageData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Edit Page: {pageId}</h1>

      <form onSubmit={handleSave} className="space-y-4 max-w-xl">
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Title
          </label>
          <input
            id="title"
            name="title"
            value={pageData.title}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Content
          </label>
          <textarea
            id="content"
            name="content"
            rows={6}
            value={pageData.content}
            onChange={handleChange}
            className="border p-2 w-full rounded"
            required
          />
        </div>

        <div className="flex items-center justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard")}
            className="px-5 py-2 border rounded text-gray-600 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
