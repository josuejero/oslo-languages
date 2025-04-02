// src/pages/admin/login.tsx
import { useState, useEffect, useCallback } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui';
import { logger } from '@/utils/logger';

export default function AdminLogin() {
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Improved redirect handler with state management
  const redirectToAdmin = useCallback(() => {
    if (redirecting) return; // Prevent multiple redirects
    
    setRedirecting(true);
    logger.info('Redirecting to admin dashboard from login page');
    
    // Use window.location for a hard redirect to break potential loops
    window.location.href = '/admin';
  }, [redirecting]);

  // Handle existing session
  useEffect(() => {
    // Only redirect if we have a confirmed authenticated session
    if (status === 'authenticated' && session?.user) {
      logger.info('User already authenticated, redirecting to dashboard', {
        user: session.user.email,
        redirecting
      });
      redirectToAdmin();
    }
  }, [status, session, redirectToAdmin]);

  // Handle query string errors
  useEffect(() => {
    if (!searchParams) return;

    const errorParam = searchParams.get('error');
    if (errorParam) {
      const errorMap: Record<string, string> = {
        CredentialsSignin: 'Invalid email or password. Please try again.',
        SessionRequired: 'Please sign in to access this page.',
        AccessDenied: 'You do not have permission to access this page.',
        Default: `Authentication error: ${errorParam}`,
      };

      const errorMessage = errorMap[errorParam] || errorMap.Default;
      setError(errorMessage);
      logger.error('Login error from URL:', { error: errorParam });
    }
  }, [searchParams]);

  // Improved form submission with better error handling
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      logger.info('Attempting to sign in', { email });
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.ok) {
        logger.info('Sign in successful, redirecting to admin page');
        
        // Mark time of successful login to detect and break loops
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('adminLoginSuccess', Date.now().toString());
        }
        
        // Use the redirect handler for consistency
        redirectToAdmin();
        return;
      }

      logger.error('Sign in failed', { error: result?.error });
      setError(result?.error || 'Failed to sign in');
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unexpected error occurred';
      logger.error('Exception during sign in', { errorMessage });
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // If we're already redirecting, show a loading state
  if (redirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="text-center">
          <h2 className="text-xl font-medium text-gray-900">Redirecting to admin dashboard...</h2>
          <div className="mt-4 w-8 h-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to access the admin dashboard
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="my-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}