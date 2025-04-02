// src/pages/admin.tsx
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { LoadingSpinner } from '@/components/ui';
import { logger } from '@/utils/logger';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isClient, setIsClient] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Verify we're on the client and set up initial state
  useEffect(() => {
    setIsClient(true);
    
    // Check for admin login success marker and clean it up
    if (typeof window !== 'undefined') {
      const loginSuccess = sessionStorage.getItem('adminLoginSuccess');
      if (loginSuccess) {
        logger.info('Found adminLoginSuccess marker, clearing it');
        sessionStorage.removeItem('adminLoginSuccess');
      }
    }
  }, []);

  // Handle authentication status changes
  useEffect(() => {
    logger.info('Admin page - Session status:', {
      status,
      hasSession: !!session,
      userEmail: session?.user?.email || 'none',
    });

    // Redirect to login if confirmed unauthenticated
    if (status === 'unauthenticated') {
      logger.info('User unauthenticated, redirecting to login page');
      router.replace('/admin/login');
      return;
    }

    // Set admin status if we have a session
    if (status === 'authenticated' && session?.user) {
      const isAdminUser = session.user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
      setIsAdmin(isAdminUser);
      
      if (!isAdminUser) {
        logger.warn('Authenticated user is not admin, redirecting to login', {
          userEmail: session.user.email
        });
        router.replace('/admin/login?error=AccessDenied');
      }
    }
  }, [status, session, router]);

  // Don't render during SSR
  if (!isClient) {
    return null;
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Authenticated but not admin
  if (status === 'authenticated' && !isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-2">Access Denied</h1>
          <p className="mb-4">You don&apos;t have permission to access the admin dashboard.</p>
          <button
            onClick={() => {
              router.push('/');
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  // Render dashboard if authenticated and admin
  if (status === 'authenticated' && isAdmin) {
    return <AdminDashboard />;
  }

  // Fallback loading state
  return (
    <div className="flex items-center justify-center min-h-screen">
      <LoadingSpinner />
    </div>
  );
}