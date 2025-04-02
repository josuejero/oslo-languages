// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { logger } from '@/utils/logger';

export function middleware(request: NextRequest) {
  // Check if request is for admin pages (except login)
  if (
    (request.nextUrl.pathname.startsWith('/admin') && 
     !request.nextUrl.pathname.startsWith('/admin/login')) ||
    request.nextUrl.pathname === '/admin'
  ) {
    // Check for auth cookie
    const authCookie = request.cookies.get('admin_auth');
    
    if (!authCookie) {
      logger.info('Auth middleware: redirecting to login', {
        path: request.nextUrl.pathname
      });
      
      // Redirect to login page
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }
  
  // Process other routes normally
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*'
  ],
};