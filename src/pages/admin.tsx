// src/pages/admin.tsx
import { Metadata } from 'next';
import AdminDashboard from '@/components/admin/AdminDashboard';
 import { useSession } from 'next-auth/react';
 import { useRouter } from 'next/navigation';
 import { useEffect } from 'react';
 import { LoadingSpinner } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Oslo Languages',
  description: 'Admin dashboard for Oslo Languages website management',
  robots: {
    index: false,
    follow: false
  }
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    // If authentication fails, redirect to login
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);
  
  // Show loading state while checking authentication
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }
  
  // Only render dashboard if authenticated
  if (status === 'authenticated') {
    return <AdminDashboard />;
  }
  
  // Return empty div while redirecting
  return <div></div>;
}