// src/components/providers/AuthProvider.tsx
'use client';

import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  // IMPORTANT: Don't add basePath here - this was causing the redirect loop
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}