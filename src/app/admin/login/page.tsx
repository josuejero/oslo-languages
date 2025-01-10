// src/app/admin/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        const errorMessage = result.error === 'CredentialsSignin' 
          ? 'Invalid email or password'
          : result.error;
        setFormError(errorMessage);
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setFormError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-secondary">
      <div className="max-w-md w-full space-y-8 p-8 bg-bg-tertiary rounded-lg shadow-xl">
        <div>
          <h1 className="text-3xl font-bold text-center text-text-primary">
            Admin Login
          </h1>
        </div>

        {formError && (
          <div className="bg-red-100 text-red-700 p-3 rounded">
            {formError}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label 
              htmlFor="email" 
              className="block text-sm font-medium text-text-primary"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 block w-full px-3 py-2 bg-bg-secondary border border-text-secondary rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
            />
          </div>

          <div>
            <label 
              htmlFor="password" 
              className="block text-sm font-medium text-text-primary"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="mt-1 block w-full px-3 py-2 bg-bg-secondary border border-text-secondary rounded-md shadow-sm focus:outline-none focus:ring-accent-primary focus:border-accent-primary"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-accent-primary hover:bg-accent-secondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary disabled:opacity-50"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}