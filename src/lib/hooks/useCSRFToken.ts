// src/lib/hooks/useCSRFToken.ts

import { useState, useEffect } from 'react';

export function useCSRFToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/api/csrf', {
          method: 'GET',
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setToken(data.token);
        }
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchToken();
  }, []);

  return token;
}

// Add this to verify CSRF token on form submissions
export function useSecureForm() {
  const csrfToken = useCSRFToken();

  const submitForm = async (
    url: string,
    data: FormData | Record<string, unknown>,
    options: RequestInit = {}
  ) => {
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    const headers = new Headers(options.headers);
    headers.set('X-CSRF-Token', csrfToken);

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
      body: data instanceof FormData ? data : JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => null);
      throw new Error(error?.message || 'Form submission failed');
    }

    return response.json();
  };

  return { submitForm, csrfToken };
}