// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Specifically exclude the login page from authentication
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }
  
  // Protect all other admin routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    // Validate token using NextAuth's JWT utility with your secret
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};