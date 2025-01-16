// src/lib/middleware/csrf.ts
import { NextRequest, NextResponse } from 'next/server';
import { createHash, randomBytes } from 'crypto';
import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next';

const CSRF_SALT = process.env.CSRF_SALT || randomBytes(16).toString('hex');
const CSRF_SECRET = process.env.CSRF_SECRET || randomBytes(32).toString('hex');

export function generateToken(sessionId: string): string {
  const timestamp = Date.now();
  const payload = `${sessionId}${timestamp}${CSRF_SALT}`;
  return createHash('sha256')
    .update(payload + CSRF_SECRET)
    .digest('hex');
}

export function validateToken(token: string, sessionId: string): boolean {
  // Tokens expire after 4 hours
  const MAX_AGE = 4 * 60 * 60 * 1000;
  const timestamp = parseInt(token.slice(0, 13), 10);
  
  if (Date.now() - timestamp > MAX_AGE) {
    return false;
  }

  const expectedToken = generateToken(sessionId);
  return token === expectedToken;
}

export async function csrfMiddleware(request: NextRequest) {
  // Skip CSRF check for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return NextResponse.next();
  }

  const sessionId = request.cookies.get('sessionId')?.value;
  const csrfToken = request.headers.get('X-CSRF-Token');

  if (!sessionId || !csrfToken) {
    return new NextResponse(
      JSON.stringify({ error: 'CSRF token missing' }),
      { status: 403 }
    );
  }

  if (!validateToken(csrfToken, sessionId)) {
    return new NextResponse(
      JSON.stringify({ error: 'Invalid CSRF token' }),
      { status: 403 }
    );
  }

  return NextResponse.next();
}

// React hook for CSRF token management
export function useCsrfToken() {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    const sessionId = getCookie('sessionId');
    if (sessionId && typeof sessionId === 'string') {
      setCsrfToken(generateToken(sessionId));
    }
  }, []);

  return csrfToken;
}