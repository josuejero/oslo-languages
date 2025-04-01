import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { LoadingSpinner } from '@/components/ui';
import { logger } from '@/utils/logger';

export default function AdminPage() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      logger.info('Session not authenticated, redirecting to login page');
      router.push('/admin/login');
    },
  });
  const [isClient, setIsClient] = useState(false);

  // Log session status and clear login attempt flag if necessary
  useEffect(() => {
    logger.info('Admin page - Session status:', {
      status,
      hasSession: !!session,
      userEmail: session?.user?.email || 'none',
    });

    if (typeof window !== 'undefined') {
      const loginAttempt = sessionStorage.getItem('adminLoginAttempt');
      if (loginAttempt) {
        const timestamp = parseInt(loginAttempt);
        const now = Date.now();
        logger.info('Found recent login attempt', {
          timestamp,
          timeSince: now - timestamp,
          isRecent: (now - timestamp) < 10000, // 10 seconds
        });
        if (status === 'authenticated' && (now - timestamp) < 10000) {
          logger.info('Clearing adminLoginAttempt flag');
          sessionStorage.removeItem('adminLoginAttempt');
        }
      }
    }
  }, [session, status]);

  // Check for force redirect flag from the login page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const forceRedirect = sessionStorage.getItem('forceAdminRedirect');
      const loginTime = sessionStorage.getItem('adminLoginTime');
      logger.info('Checking force redirect flags', {
        forceRedirect,
        loginTime,
        currentTime: Date.now(),
        timeSinceLogin: loginTime ? Date.now() - parseInt(loginTime) : 'no login time',
      });
      if (forceRedirect === 'true' && window.location.pathname === '/admin/login') {
        logger.info('Force redirect flag found on login page, redirecting to admin dashboard');
        sessionStorage.removeItem('forceAdminRedirect');
        window.location.replace('/admin');
      }
    }
  }, []);

  // Client-side initialization and final session flag cleanup
  useEffect(() => {
    setIsClient(true);
    logger.info('Client-side initialization complete in admin page');

    setTimeout(() => {
      if (status === 'authenticated') {
        logger.info('Confirmed authenticated session after delay', {
          email: session?.user?.email || 'unknown',
        });
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem('adminLoginAttempt');
          sessionStorage.removeItem('adminLoginTime');
          sessionStorage.removeItem('forceAdminRedirect');
          sessionStorage.removeItem('loginLoopCount');
          sessionStorage.removeItem('loginLoopStart');
        }
      } else if (status === 'loading') {
        logger.warn('Session still loading after delay');
      } else if (status === 'unauthenticated') {
        logger.warn('No valid session after delay, redirecting to login');
        router.replace('/admin/login');
      }
    }, 1000); // Increased delay for session establishment
  }, [status, session, router]);

  // Log every render with detailed state
  useEffect(() => {
    logger.info('Admin page rendering', {
      status,
      hasSession: !!session,
      sessionUser: session?.user?.email || 'none',
      sessionExpiry: session?.expires || 'unknown',
      isClient,
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : 'server-side',
      sessionStorageFlags: typeof window !== 'undefined'
        ? {
            adminLoginAttempt: sessionStorage.getItem('adminLoginAttempt') || 'not set',
            adminLoginTime: sessionStorage.getItem('adminLoginTime') || 'not set',
            forceAdminRedirect: sessionStorage.getItem('forceAdminRedirect') || 'not set',
          }
        : 'server-side',
    });
  });

  // Don't render during SSR
  if (!isClient) {
    logger.info('Skipping render during SSR');
    return null;
  }

  // Loading state
  if (status === 'loading') {
    logger.info('Rendering loading state');
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // Render dashboard if authenticated
  if (status === 'authenticated') {
    logger.info('User authenticated, rendering admin dashboard');
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('adminLoginAttempt');
      sessionStorage.removeItem('adminLoginTime');
      sessionStorage.removeItem('forceAdminRedirect');
    }
    return <AdminDashboard />;
  }

  // Fallback UI (should not normally be reached)
  logger.warn('Fallback case reached in admin page - user not authenticated');
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-xl font-bold mb-2">Authentication Required</h1>
        <p className="mb-4">Please log in to access the admin dashboard.</p>
        <button
          onClick={() => {
            logger.info('Login button clicked in fallback UI');
            router.push('/admin/login');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
