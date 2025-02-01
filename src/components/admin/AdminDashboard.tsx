// src/components/admin/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert } from '@/components/ui/alert';
import { logger } from '@/lib/logger';
import BlogManager from '@/components/admin/BlogManager';

interface ContentSection {
  title: string;
  content: string;
}

interface ContentState {
  [key: string]: ContentSection;
}

// Content Editor Component
const ContentEditor = () => {
  const [sections, setSections] = useState<ContentState>({
    home: { title: '', content: '' },
    about: { title: '', content: '' },
    courses: { title: '', content: '' }
  });

  const handleSave = async (section: string) => {
    try {
      const response = await fetch(`/api/admin/content/${section}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sections[section])
      });
      
      if (!response.ok) throw new Error('Failed to save content');
      
      logger.info('Content saved successfully', { section });
    } catch (error) {
      logger.error('Failed to save content', {
        error: error instanceof Error ? error.message : 'Unknown error',
        section
      });
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(sections).map(([section, content]) => (
        <div key={section} className="space-y-4">
          <h3 className="text-xl font-semibold capitalize">{section} Page</h3>
          <div className="space-y-4">
            <input
              type="text"
              value={content.title}
              onChange={(e) => setSections(prev => ({
                ...prev,
                [section]: { ...prev[section], title: e.target.value }
              }))}
              placeholder="Page Title"
              className="w-full p-2 border rounded"
            />
            <textarea
              value={content.content}
              onChange={(e) => setSections(prev => ({
                ...prev,
                [section]: { ...prev[section], content: e.target.value }
              }))}
              placeholder="Page Content"
              className="w-full h-48 p-2 border rounded"
            />
            <button
              onClick={() => handleSave(section)}
              className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// Course Manager Component
const CourseManager = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Course Management</h2>
        <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
          Add New Course
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <p className="text-gray-500">Course management coming soon...</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (session?.user?.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
    return (
      <Alert variant="destructive">
        You do not have permission to access this area.
      </Alert>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <Tabs defaultValue="blog" className="space-y-4">
        <TabsList>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
        </TabsList>

        <TabsContent value="blog">
          <BlogManager />
        </TabsContent>

        <TabsContent value="content">
          <ContentEditor />
        </TabsContent>

        <TabsContent value="courses">
          <CourseManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;