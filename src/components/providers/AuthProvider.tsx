// src/components/providers/AuthProvider.tsx
'use client';

import { ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  // Simple pass-through component - no NextAuth
  return <>{children}</>;
}