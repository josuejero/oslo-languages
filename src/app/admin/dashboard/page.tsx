// src/app/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("blog");
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <button
            onClick={() => setActiveTab("blog")}
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === "blog"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Blog Posts
          </button>
          <button
            onClick={() => setActiveTab("pages")}
            className={`py-4 px-6 font-medium text-sm ${
              activeTab === "pages"
                ? "border-b-2 border-blue-500 text-blue-600"
                : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Static Pages
          </button>
        </nav>
      </div>
      
      {/* Blog Posts Tab Content */}
      {activeTab === "blog" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Blog Posts</h2>
            <Link
              href="/admin/blog/new"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              New Post
            </Link>
          </div>
          
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">5 Tips to Improve Your Norwegian Pronunciation</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Norwegian</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">April 1, 2025</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <Link href="/admin/blog/edit/1" className="text-blue-600 hover:text-blue-900 mr-4">Edit</Link>
                    <button className="text-red-600 hover:text-red-900">Delete</button>
                  </td>
                </tr>
                {/* More blog posts would be listed here */}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      {/* Static Pages Tab Content */}
      {activeTab === "pages" && (
        <div>
          <h2 className="text-xl font-semibold mb-6">Static Pages</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Home Page</h3>
              <p className="text-gray-600 mb-4">Main landing page with hero section and course highlights</p>
              <Link
                href="/admin/pages/edit/home"
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Content
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">About Page</h3>
              <p className="text-gray-600 mb-4">School history, methodology, and teacher profiles</p>
              <Link
                href="/admin/pages/edit/about"
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Content
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Courses Page</h3>
              <p className="text-gray-600 mb-4">Language courses offered by the school</p>
              <Link
                href="/admin/pages/edit/courses"
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Content
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium mb-2">Legal Pages</h3>
              <p className="text-gray-600 mb-4">Privacy policy and terms of service</p>
              <Link
                href="/admin/pages/edit/legal"
                className="text-blue-600 hover:text-blue-800"
              >
                Edit Content
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}