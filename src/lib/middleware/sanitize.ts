// src/lib/middleware/sanitize.ts
import { NextRequest } from 'next/server';
import DOMPurify from 'isomorphic-dompurify';
import { logger } from '../logger';

// Define allowed HTML tags and attributes
const ALLOWED_TAGS = [
  'p', 'br', 'b', 'i', 'em', 'strong', 'a', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote'
];

const ALLOWED_ATTR = ['href', 'title', 'target'];

// Define regex patterns for validation
const PATTERNS = {
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  phone: /^\+?[\d\s-]{8,}$/,
  name: /^[a-zA-Z\s-']{2,50}$/,
  url: /^https?:\/\/[\w\-.]+(:\d+)?([/\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/
};

export function sanitizeString(input: string, type?: keyof typeof PATTERNS): string {
  // Basic sanitization
  const sanitized = DOMPurify.sanitize(input.trim(), {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });

  // Pattern validation if type is specified
  if (type && PATTERNS[type]) {
    if (!PATTERNS[type].test(sanitized)) {
      logger.warn('Invalid input pattern', { type, input: sanitized });
      throw new Error(`Invalid ${type} format`);
    }
  }

  return sanitized;
}

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_TAGS: ['script', 'style', 'iframe', 'form'],
    FORBID_ATTR: ['onload', 'onclick', 'onmouseover', 'style'],
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
  });
}

export function sanitizeFileName(fileName: string): string {
  // Remove any directory traversal attempts
  const sanitized = fileName.replace(/^.*[\\/]/, '');
  
  // Remove any non-allowed characters
  return sanitized.replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')  // Prevent consecutive dots
    .slice(0, 255);  // Limit length
}

export async function sanitizeMiddleware(request: NextRequest): Promise<NextRequest> {
  if (['POST', 'PUT', 'PATCH'].includes(request.method)) {
    const contentType = request.headers.get('content-type');

    if (contentType?.includes('application/json')) {
      try {
        const body = await request.json();
        const sanitizedBody = sanitizeRequestBody(body);

        // Create new request with sanitized body
        const newRequest = new Request(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(sanitizedBody)
        });

        return newRequest as NextRequest;
      } catch (error) {
        logger.error('Sanitization error:', { error });
        throw error;
      }
    }

    if (contentType?.includes('multipart/form-data')) {
      const formData = await request.formData();
      const sanitizedFormData = new FormData();

      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          // Sanitize file name and validate mime type
          const sanitizedName = sanitizeFileName(value.name);
          sanitizedFormData.append(key, new File([value], sanitizedName, {
            type: value.type
          }));
        } else {
          sanitizedFormData.append(key, sanitizeString(value.toString()));
        }
      }

      const newRequest = new Request(request.url, {
        method: request.method,
        headers: request.headers,
        body: sanitizedFormData
      });

      return newRequest as NextRequest;
    }
  }

  return request;
}

function sanitizeRequestBody(body: unknown): unknown {
  if (typeof body !== 'object' || body === null) {
    return typeof body === 'string' ? sanitizeString(body) : body;
  }

  if (Array.isArray(body)) {
    return body.map(item => sanitizeRequestBody(item));
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    sanitized[key] = sanitizeRequestBody(value);
  }

  return sanitized;
}