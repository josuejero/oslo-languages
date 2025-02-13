// src/components/providers/AuthProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { JSX, ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

// src/components/providers/AuthProvider.tsx
export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const baseUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000'
    : process.env.NEXTAUTH_URL;

  return (
    <SessionProvider basePath={`${baseUrl}/api/auth`}>
      {children}
    </SessionProvider>
  );
}