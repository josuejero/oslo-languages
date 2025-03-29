import { useState, useEffect } from 'react';
import { signIn, getCsrfToken, getProviders, SignInResponse } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Alert, AlertDescription } from '@/components/ui';
import { logger } from '@/utils/logger';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<Record<string, unknown>>({});
  const router = useRouter();

  // Show error from URL if present
  useEffect(() => {
    // Handle error from query parameter
    if (router.query.error) {
      const errorMap: Record<string, string> = {
        'CredentialsSignin': 'Invalid email or password. Please try again.',
        'SessionRequired': 'Please sign in to access this page.',
        'AccessDenied': 'You do not have permission to access this page.',
        'Default': `Authentication error: ${router.query.error}`
      };

      const errorMessage = errorMap[router.query.error as string] || errorMap.Default;
      setError(errorMessage);
      
      logger.error('Login error from URL:', { 
        error: router.query.error,
        message: errorMessage
      });
    }
    
    // Load CSRF token and providers for debugging
    const loadAuthInfo = async () => {
      try {
        const [csrfToken, providers] = await Promise.all([
          getCsrfToken(),
          getProviders()
        ]);
        
        const authInfo = {
          csrfToken: csrfToken ? 'Present' : 'Missing',
          providers: providers ? Object.keys(providers) : 'None found'
        };
        
        setDebugInfo(authInfo);
        logger.info('Auth Debug Info:', authInfo);
      } catch (e) {
        logger.error('Failed to load auth info:', { error: e });
      }
    };
    
    loadAuthInfo();
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    logger.info('Login attempt:', { 
      email, 
      passwordLength: password.length 
    });

    try {
      // Try multiple strategies if needed
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/admin'
      }) as SignInResponse | null;
      
      logger.info('SignIn result:', { result });

      if (result?.error) {
        logger.error('Login error from result:', { error: result.error });
        
        // Map error codes to user-friendly messages
        const errorMap: Record<string, string> = {
          'CredentialsSignin': 'Invalid email or password. Please try again.',
          'Default': `Authentication error: ${result.error}`
        };
        
        setError(errorMap[result.error] || errorMap.Default);
      } else if (result?.url) {
        logger.info('Login successful, redirecting to:', { url: result.url });
        router.push(result.url);
      } else {
        setError('Unknown error occurred during sign in');
        logger.error('Unexpected signin result format:', { result });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(`Login failed: ${errorMessage}`);
      logger.error('Login exception:', { error });
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
          
          {/* Debug Info - only in development */}
          {process.env.NODE_ENV === 'development' && Object.keys(debugInfo).length > 0 && (
            <div className="mt-4 p-3 border border-gray-300 rounded-md bg-gray-50">
              <h3 className="text-sm font-medium text-gray-700">Debug Info:</h3>
              <pre className="mt-1 text-xs text-gray-600">{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
