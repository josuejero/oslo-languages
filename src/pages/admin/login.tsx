import { useState, useEffect } from 'react';
import { signIn, getCsrfToken, getProviders, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Alert, AlertDescription } from '@/components/ui';
import { logger } from '@/utils/logger';

export default function AdminLogin() {
  // Add session check
  const { data: session, status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // If user is already authenticated, redirect to admin dashboard
    if (status === 'authenticated') {
      logger.info('User already authenticated, redirecting to dashboard', {
        user: session.user.email
      });
      
      // Direct, forced navigation to admin page
      window.location.replace('/admin');
    }
  }, [status, session]);

  useEffect(() => {
    // If searchParams is null, exit early to avoid TS errors.
    if (!searchParams) return;

    const errorParam = searchParams.get('error');
    const errorDesc = searchParams.get('error_description');
    if (errorParam) {
      const errorMap: Record<string, string> = {
        'CredentialsSignin': 'Invalid email or password. Please try again.',
        'SessionRequired': 'Please sign in to access this page.',
        'AccessDenied': 'You do not have permission to access this page.',
        'CallbackRouteError': 'There was a problem with the login callback.',
        'OAuthSignin': 'Error in OAuth sign in process.',
        'OAuthCallback': 'Error in OAuth callback process.',
        'Default': `Authentication error: ${errorParam}`
      };

      const errorMessage = errorMap[errorParam] || errorMap.Default;
      setError(errorMessage);

      logger.error('Login error from URL:', { 
        error: errorParam,
        message: errorMessage,
        errorDetails: errorDesc || 'No additional details'
      });
    }
    
    const loadAuthInfo = async () => {
      try {
        const [csrfToken, providers] = await Promise.all([
          getCsrfToken(),
          getProviders()
        ]);
        
        const authInfo = {
          csrfToken: csrfToken ? 'Present' : 'Missing',
          providers: providers ? Object.keys(providers) : 'None found',
          adminEmailConfigured: process.env.NEXT_PUBLIC_ADMIN_EMAIL ? 'Yes (public)' : 'Not in public env',
          nextAuthUrl: process.env.NEXT_PUBLIC_BASE_URL || 'Not configured in public env',
        };
        
        setDebugInfo(authInfo);
        logger.info('Auth Debug Info:', authInfo);
      } catch (e) {
        logger.error('Failed to load auth info:', { 
          error: e instanceof Error ? e.message : String(e),
          stack: e instanceof Error ? e.stack : undefined 
        });
        setDebugInfo({ error: 'Failed to load auth info' });
      }
    };
    
    loadAuthInfo();
  }, [searchParams]);

// src/pages/admin/login.tsx - Partial fix for the handleSubmit function
// Replace just the handleSubmit function in your existing file

// src/pages/admin/login.tsx - Updated handleSubmit function
useEffect(() => {
  // If user is already authenticated, redirect to admin dashboard
  if (status === 'authenticated') {
    logger.info('User already authenticated, redirecting to dashboard', {
      user: session.user.email
    });
    
    // Direct, forced navigation to admin page
    window.location.replace('/admin');
  }
}, [status, session]);

// Update handleSubmit function to use a more direct approach
// src/pages/admin/login.tsx
// Replace the handleSubmit function with:

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    logger.info('Login attempt:', { 
      email, 
      passwordLength: password.length,
      timestamp: new Date().toISOString()
    });

    try {
      // Store login attempt timestamp in session storage
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('adminLoginAttempt', Date.now().toString());
      }
      
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password
      });
      
      logger.info('SignIn result:', { 
        ok: result?.ok,
        error: result?.error,
        status: result?.status
      });
      
      if (result?.ok) {
        logger.info('Authentication successful, setting redirect flag');
        
        // Set a flag indicating successful auth
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('adminLoginTime', Date.now().toString());
          sessionStorage.setItem('forceAdminRedirect', 'true');
        }
        
        // Give a slight delay to allow session to be established
        setTimeout(() => {
          logger.info('Delayed redirect to admin dashboard');
          window.location.replace('/admin');
        }, 500);
        return;
      }
      
      setError(result?.error || 'Failed to sign in');
      logger.error('Sign in failed:', { error: result?.error });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      logger.error('Login error:', { error: errorMessage });
    } finally {
      setLoading(false);
    }
  };

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
          
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-3 border border-gray-300 rounded-md bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Debug Info:</h3>
              <pre className="mt-1 text-xs text-gray-600 overflow-auto max-h-32">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
