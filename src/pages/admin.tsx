// src/pages/admin.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { LoadingSpinner } from '@/components/ui';

export default function AdminPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      // This ensures the redirect happens on the client side properly
      router.push('/admin/login');
    },
  });
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);
  
  // Ensure we're running on client-side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Don't render anything during SSR to avoid flashes
  if (!isClient) {
    return null;
  }
  
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
  
  // This shouldn't render given the onUnauthenticated callback,
  // but included as a fallback
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">Authentication Required</h1>
        <p className="mb-4">Please log in to access the admin dashboard.</p>
        <button 
          onClick={() => router.push('/admin/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}