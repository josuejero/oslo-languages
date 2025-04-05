import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  // Protect admin routes, excluding the login page
  if (
    request.nextUrl.pathname.startsWith('/admin') &&
    !request.nextUrl.pathname.includes('/admin/login')
  ) {
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
