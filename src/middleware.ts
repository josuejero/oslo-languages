// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/utils/logger';

export function middleware(request: NextRequest) {
  // Log all middleware requests for debugging
  logger.info(`Middleware processing: ${request.nextUrl.pathname}`);

  // Skip middleware for API routes to prevent redirect loops
  if (request.nextUrl.pathname.startsWith('/api/')) {
    logger.info(`Skipping middleware for API route: ${request.nextUrl.pathname}`);
    return NextResponse.next();
  }

  // Your other middleware logic here
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};