// src/pages/admin/login.tsx
import { useState, useEffect } from 'react';
import { signIn, getCsrfToken, getProviders } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState<any>({});
  const router = useRouter();

  // Show error from URL if present
  useEffect(() => {
    if (router.query.error) {
      setError(`Error: ${router.query.error}`);
      console.log('Login error from URL:', router.query.error);
    }
    
    // Load CSRF token and providers for debugging
    const loadDebugInfo = async () => {
      try {
        const [csrfToken, providers] = await Promise.all([
          getCsrfToken(),
          getProviders()
        ]);
        
        setDebugInfo({
          csrfToken: csrfToken ? 'Present' : 'Missing',
          providers: providers ? Object.keys(providers) : 'None found'
        });
        
        console.log('Auth Debug Info:', {
          csrfToken: csrfToken ? 'Present' : 'Missing',
          providers
        });
      } catch (e) {
        console.error('Failed to load debug info:', e);
      }
    };
    
    loadDebugInfo();
  }, [router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    console.log('Login attempt:', { email, passwordLength: password.length });

    try {
      // Try to sign in
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: '/admin'
      });
      
      console.log('SignIn result:', result);

      if (result?.error) {
        setError(result.error);
        console.error('Login error from result:', result.error);
      } else if (result?.url) {
        console.log('Login successful, redirecting to:', result.url);
        router.push(result.url);
      } else {
        setError('Unknown error occurred');
        console.error('Unexpected result format:', result);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      console.error('Login exception:', error);
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