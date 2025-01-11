// src/lib/middleware/sanitize.ts
import { NextRequest } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';

export async function sanitizeMiddleware(request: NextRequest): Promise<NextRequest> {
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      const sanitizedBody = sanitizeObject(body);
      const newRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: JSON.stringify(sanitizedBody),
      });
      return newRequest as NextRequest;
    }
  }
  return request;
}

function sanitizeObject(obj: unknown): unknown {
  if (typeof obj !== 'object' || obj === null) {
    return typeof obj === 'string' ? DOMPurify.sanitize(obj) : obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => sanitizeObject(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    sanitized[key] = sanitizeObject(value);
  }
  return sanitized;
}