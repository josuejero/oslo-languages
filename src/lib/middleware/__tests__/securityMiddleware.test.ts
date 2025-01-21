// src/lib/middleware/__tests__/securityMiddleware.test.ts

import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from '../securityMiddleware';
import { generateToken } from '../csrf';

// Mock Next.js response
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      next: jest.fn(() => ({
        headers: new Map(),
      })),
      json: jest.fn((body, init) => ({
        ...new originalModule.NextResponse(JSON.stringify(body), init),
        status: init?.status || 200,
      })),
    },
  };
});

describe('Security Middleware', () => {
  let mockRequest: Partial<NextRequest>;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a more complete mock request
    const headers = new Headers();
    const cookies = new Map();
    
    mockRequest = {
      method: 'POST',
      url: 'http://localhost:3000/api/test',
      headers,
      cookies: {
        get: jest.fn((key: string) => ({ value: cookies.get(key) })),
        set: jest.fn((key: string, value: string) => cookies.set(key, value)),
        getAll: jest.fn(() => Array.from(cookies.entries())),
        has: jest.fn((key: string) => cookies.has(key)),
        delete: jest.fn((key: string) => cookies.delete(key)),
        [Symbol.iterator]: jest.fn(),
        entries: jest.fn(),
        keys: jest.fn(),
        values: jest.fn(),
        toString: jest.fn(),
        size: cookies.size,
      },
      clone: jest.fn(),
      body: null,
      bodyUsed: false,
      cache: 'default',
      credentials: 'same-origin',
      destination: '',
      integrity: '',
      keepalive: false,
      mode: 'cors',
      redirect: 'follow',
      referrer: '',
      referrerPolicy: 'no-referrer',
      signal: new AbortController().signal,
    } as unknown as Partial<NextRequest>;
  });

  describe('CSRF Protection', () => {
    it('should allow GET requests without CSRF token', async () => {
      const request = {
        ...mockRequest,
        method: 'GET',
      } as unknown as NextRequest;
      
      await securityMiddleware(request, { csrfProtection: true });
      expect(NextResponse.next).toHaveBeenCalled();
    });

    it('should block POST requests without CSRF token', async () => {
      const request = {
        ...mockRequest,
        method: 'POST',
      } as unknown as NextRequest;
      
      const response = await securityMiddleware(request, { csrfProtection: true });
      expect(response.status).toBe(403);
    });

    it('should allow POST requests with valid CSRF token', async () => {
      const sessionId = 'test-session';
      const token = generateToken(sessionId);
      
      const headers = new Headers();
      headers.set('X-CSRF-Token', token);
      
      const request = {
        ...mockRequest,
        method: 'POST',
        headers,
        cookies: {
          ...mockRequest.cookies,
          get: jest.fn().mockReturnValue({ value: sessionId }),
        },
      } as unknown as NextRequest;

      await securityMiddleware(request, { csrfProtection: true });
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe('Input Sanitization', () => {
    it('should sanitize JSON request body', async () => {
      const unsafeBody = {
        name: '<script>alert("xss")</script>',
        email: 'test@example.com'
      };

      const request = {
        ...mockRequest,
        json: jest.fn().mockResolvedValue(unsafeBody),
      } as unknown as NextRequest;

      await securityMiddleware(request, { inputSanitization: true });
      
      const newRequest = (NextResponse.next as jest.Mock).mock.calls[0][0].request;
      const sanitizedBody = JSON.parse(await newRequest.text());
      expect(sanitizedBody.name).not.toContain('<script>');
    });

    it('should sanitize form data', async () => {
      const formData = new FormData();
      formData.append('name', '<script>alert("xss")</script>');
      
      const request = {
        ...mockRequest,
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      await securityMiddleware(request, { inputSanitization: true });
      
      const newRequest = (NextResponse.next as jest.Mock).mock.calls[0][0].request;
      const sanitizedFormData = await newRequest.formData();
      expect(sanitizedFormData.get('name')).not.toContain('<script>');
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types', async () => {
      const formData = new FormData();
      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      formData.append('file', file);

      const request = {
        ...mockRequest,
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      const response = await securityMiddleware(request, { fileUploadSecurity: true });
      expect(response.status).toBe(400);
    });

    it('should validate file size', async () => {
      const formData = new FormData();
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      formData.append('file', largeFile);

      const request = {
        ...mockRequest,
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      const response = await securityMiddleware(request, { fileUploadSecurity: true });
      expect(response.status).toBe(400);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limits', async () => {
      const headers = new Headers();
      headers.set('x-forwarded-for', '127.0.0.1');

      const request = {
        ...mockRequest,
        headers,
      } as unknown as NextRequest;

      // Make multiple requests
      const responses = await Promise.all([
        securityMiddleware(request, { rateLimit: { maxRequests: 2, windowMs: 1000 } }),
        securityMiddleware(request, { rateLimit: { maxRequests: 2, windowMs: 1000 } }),
        securityMiddleware(request, { rateLimit: { maxRequests: 2, windowMs: 1000 } })
      ]);

      // Third request should be rate limited
      expect(responses[2].status).toBe(429);
    });
  });
});