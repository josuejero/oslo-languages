// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/utils/logger';

export function middleware(request: NextRequest) {
  // Log all middleware processing
  logger.info(`Middleware processing: ${request.nextUrl.pathname}`);

  // Core logic remains the same, but we'll rely on the improved matcher pattern
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - API routes (/api/*)
     * - Next.js static files (_next/static/*)
     * - Next.js image optimization files (_next/image/*)
     * - Favicon (favicon.ico)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
