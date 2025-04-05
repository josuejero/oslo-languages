// src/app/admin/dashboard/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

interface DashboardSectionProps {
  title: string;
  children: React.ReactNode;
}

function DashboardSection({ title, children }: DashboardSectionProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">{title}</h2>
        {title === "Blog Posts" && (
          <Link
            href="/admin/blog/new"
            className="btn-primary"
          >
            New Post
          </Link>
        )}
      </div>
      {children}
    </div>
  );
}

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function TabButton({ label, isActive, onClick }: TabButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`py-4 px-6 font-medium text-sm ${
        isActive
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-500 hover:text-gray-700 hover:border-gray-300"
      }`}
    >
      {label}
    </button>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("blog");
  
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex -mb-px">
          <TabButton 
            label="Blog Posts" 
            isActive={activeTab === "blog"} 
            onClick={() => setActiveTab("blog")} 
          />
          <TabButton 
            label="Static Pages" 
            isActive={activeTab === "pages"} 
            onClick={() => setActiveTab("pages")} 
          />
        </nav>
      </div>
      
      {/* Blog Posts Tab Content */}
      {activeTab === "blog" && (
        <DashboardSection title="Blog Posts">
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
              </tbody>
            </table>
          </div>
        </DashboardSection>
      )}
      
      {/* Static Pages Tab Content */}
      {activeTab === "pages" && (
        <DashboardSection title="Static Pages">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {["Home", "About", "Courses", "Legal"].map((page) => (
              <div key={page} className="card">
                <h3 className="text-lg font-medium mb-2">{page} Page</h3>
                <p className="text-gray-600 mb-4">
                  {getPageDescription(page)}
                </p>
                <Link
                  href={`/admin/pages/edit/${page.toLowerCase()}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit Content
                </Link>
              </div>
            ))}
          </div>
        </DashboardSection>
      )}
    </div>
  );
}

// Helper function for page descriptions
function getPageDescription(page: string): string {
  const descriptions: Record<string, string> = {
    "Home": "Main landing page with hero section and course highlights",
    "About": "School history, methodology, and teacher profiles",
    "Courses": "Language courses offered by the school",
    "Legal": "Privacy policy and terms of service"
  };
  
  return descriptions[page] || "";
}