// src/lib/middleware/sanitize.ts
import { NextRequest, NextResponse } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';

function sanitizeObject(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? DOMPurify.sanitize(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const result: Record<string, unknown> = {};
  for (const key in obj as Record<string, unknown>) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = sanitizeObject((obj as Record<string, unknown>)[key]);
    }
  }
  return result;
}
export async function sanitizeMiddleware(request: NextRequest) {
  const response = NextResponse.next();

  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    try {
      const body = await request.json();
      const sanitizedBody = sanitizeObject(body);
      const modifiedRequest = new NextRequest(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(sanitizedBody),
      });
      return NextResponse.next({
        request: modifiedRequest,
      });
    } catch (error) {
      console.error('Error sanitizing request:', error);
    }
  }

  return response;
}