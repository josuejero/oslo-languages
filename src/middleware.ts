// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Check if the route is an admin route (except login)
  if (
    request.nextUrl.pathname.startsWith('/admin') && 
    !request.nextUrl.pathname.includes('/admin/login')
  ) {
    // Check for authentication - this is a simple example
    // In a real app, you would verify a JWT or session cookie
    const isAuthenticated = request.cookies.has('admin_authenticated');
    
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  // Only run middleware on admin routes
  matcher: '/admin/:path*',
};