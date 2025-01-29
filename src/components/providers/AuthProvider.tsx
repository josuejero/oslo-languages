'use client';

import { SessionProvider } from 'next-auth/react';
import { JSX, ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}