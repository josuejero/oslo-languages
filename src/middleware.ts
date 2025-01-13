// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { apiRateLimit } from './lib/rate-limit';
import { sanitizeMiddleware } from './lib/middleware/sanitize';
import { withAuth } from 'next-auth/middleware';

// CSRF token generation
function generateCSRFToken() {
  return crypto.randomUUID();
}

const authMiddleware = withAuth(
  function middleware() {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => token?.role === 'admin',
    },
    pages: {
      signIn: '/admin/login',
    },
  }
);

async function mainMiddleware(request: NextRequest, event: NextFetchEvent) {
  // For admin routes, use auth middleware
  if (request.nextUrl.pathname.startsWith('/admin/') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    return (authMiddleware as (request: NextRequest, event: NextFetchEvent) => Promise<NextResponse>)(request, event);
  }

  // Apply rate limiting to API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const rateLimitResponse = await apiRateLimit.check();
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // Apply input sanitization
  const sanitizedRequest = await sanitizeMiddleware(request);
  
  const response = NextResponse.next({
    request: sanitizedRequest,
  });

  // Security Headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "font-src 'self'; " +
    "connect-src 'self'; " +
    "media-src 'self'; " +
    "object-src 'none';"
  );

  // Set CSRF token for GET requests
  if (request.method === 'GET' && !request.nextUrl.pathname.startsWith('/api/')) {
    const csrfToken = generateCSRFToken();
    response.cookies.set('XSRF-TOKEN', csrfToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
  }

  // Verify CSRF token for mutating requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method)) {
    const csrfToken = request.headers.get('X-XSRF-TOKEN');
    const cookieToken = request.cookies.get('XSRF-TOKEN');

    if (!csrfToken || !cookieToken || csrfToken !== cookieToken.value) {
      return new NextResponse(
        JSON.stringify({ error: 'Invalid CSRF token' }),
        { status: 403 }
      );
    }
  }

  return response;
}

export default mainMiddleware;

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};