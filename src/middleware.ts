// src/middleware.ts (ES Modules version)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/utils/logger';

export function middleware(request: NextRequest) {
  // Skip middleware processing for authentication routes completely
  if (request.nextUrl.pathname.startsWith('/api/auth') || 
      request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Process other routes normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};