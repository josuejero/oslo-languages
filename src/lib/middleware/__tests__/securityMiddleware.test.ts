import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from '../securityMiddleware';
import { generateToken } from '../csrf';

// Mock Next.js response
jest.mock('next/server', () => ({
  NextResponse: {
    next: jest.fn(() => ({
      headers: new Map(),
    })),
    json: jest.fn((body, init) => ({
      ...new Response(JSON.stringify(body), init),
      status: init?.status || 200,
    })),
  },
}));

describe('Security Middleware', () => {
  let mockRequest: Partial<NextRequest>;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Create a mock request with all necessary properties
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
      formData: jest.fn(),
      json: jest.fn(),
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
      expect(JSON.parse(await response.json())).toEqual({
        error: 'Invalid CSRF token',
      });
    });

    it('should allow POST requests with valid CSRF token', async () => {
      const sessionId = 'test-session';

      const { token } = generateToken(sessionId) as unknown as { token: string };

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
    it('should block requests with expired CSRF tokens', async () => {
      const sessionId = 'test-session';
      const { token } = generateToken(sessionId) as unknown as { token: string };

      // Fast forward time to expire token
      jest.advanceTimersByTime(5 * 60 * 60 * 1000); // 5 hours

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

      const response = await securityMiddleware(request, { csrfProtection: true });
      expect(response.status).toBe(403);
    });  });

  describe('Input Sanitization', () => {
    it('should sanitize JSON request body', async () => {
      const unsafeBody = {
        name: '<script>alert("xss")</script>John',
        email: 'test@example.com',
        message: 'Hello <img src=x onerror=alert(1)>',
      };

      const request = {
        ...mockRequest,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: jest.fn().mockResolvedValue(unsafeBody),
      } as unknown as NextRequest;

      await securityMiddleware(request, { inputSanitization: true });

      const newRequest = (NextResponse.next as jest.Mock).mock.calls[0][0].request;
      const sanitizedBody = JSON.parse(await newRequest.text());

      expect(sanitizedBody.name).not.toContain('<script>');
      expect(sanitizedBody.message).not.toContain('<img');
      expect(sanitizedBody.email).toBe('test@example.com');
    });

    it('should sanitize form data', async () => {
      const formData = new FormData();
      formData.append('name', '<script>alert("xss")</script>John');
      formData.append('email', 'test@example.com');

      const request = {
        ...mockRequest,
        headers: new Headers({ 'content-type': 'multipart/form-data' }),
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      await securityMiddleware(request, { inputSanitization: true });

      const newRequest = (NextResponse.next as jest.Mock).mock.calls[0][0].request;
      const sanitizedFormData = await newRequest.formData();

      expect(sanitizedFormData.get('name')).not.toContain('<script>');
      expect(sanitizedFormData.get('email')).toBe('test@example.com');
    });
  });

  describe('File Upload Security', () => {
    it('should validate file types', async () => {
      const formData = new FormData();
      const file = new File(['test'], 'test.exe', { type: 'application/x-msdownload' });
      formData.append('file', file);

      const request = {
        ...mockRequest,
        headers: new Headers({ 'content-type': 'multipart/form-data' }),
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      const response = await securityMiddleware(request, { fileUploadSecurity: true });
      expect(response.status).toBe(400);
      expect(JSON.parse(await response.json())).toEqual({
        error: 'File type application/x-msdownload not allowed',
      });
    });

    it('should validate file size', async () => {
      const formData = new FormData();
      // Create a file larger than 5MB
      const largeFile = new File([new ArrayBuffer(6 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' });
      formData.append('file', largeFile);

      const request = {
        ...mockRequest,
        headers: new Headers({ 'content-type': 'multipart/form-data' }),
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      const response = await securityMiddleware(request, { fileUploadSecurity: true });
      expect(response.status).toBe(400);
      expect(JSON.parse(await response.json())).toEqual({
        error: 'File size exceeds maximum limit of 5MB',
      });
    });

    it('should allow valid files', async () => {
      const formData = new FormData();
      const validFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
      formData.append('file', validFile);

      const request = {
        ...mockRequest,
        headers: new Headers({ 'content-type': 'multipart/form-data' }),
        formData: jest.fn().mockResolvedValue(formData),
      } as unknown as NextRequest;

      await securityMiddleware(request, { fileUploadSecurity: true });
      expect(NextResponse.next).toHaveBeenCalled();
    });
  });

  describe('Rate Limiting Integration', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should apply rate limits', async () => {
      const config = {
        maxRequests: 2,
        windowMs: 1000, // 1 second
      };

      const headers = new Headers();
      headers.set('x-forwarded-for', '127.0.0.1');

      const request = {
        ...mockRequest,
        headers,
      } as unknown as NextRequest;

      // Make multiple requests
      const responses = await Promise.all([
        securityMiddleware(request, { rateLimit: config }),
        securityMiddleware(request, { rateLimit: config }),
        securityMiddleware(request, { rateLimit: config }),
      ]);

      // Third request should be rate limited
      expect(responses[2].status).toBe(429);
      expect(JSON.parse(await responses[2].json())).toMatchObject({
        error: 'Too many requests, please try again later.',
      });
    });

    it('should reset rate limit after window expires', async () => {
      const config = {
        maxRequests: 1,
        windowMs: 1000, // 1 second
      };

      const headers = new Headers();
      headers.set('x-forwarded-for', '127.0.0.1');

      const request = {
        ...mockRequest,
        headers,
      } as unknown as NextRequest;

      // First request should succeed
      await securityMiddleware(request, { rateLimit: config });
      expect(NextResponse.next).toHaveBeenCalled();

      // Second request should be rate limited
      const rateLimitedResponse = await securityMiddleware(request, { rateLimit: config });
      expect(rateLimitedResponse.status).toBe(429);

      // Advance time beyond rate limit window
      jest.advanceTimersByTime(1100);

      // Request should succeed again
      await securityMiddleware(request, { rateLimit: config });
      expect(NextResponse.next).toHaveBeenCalledTimes(2);
    });

    it('should track rate limits separately by IP', async () => {
      const config = {
        maxRequests: 1,
        windowMs: 1000,
      };

      const request1 = {
        ...mockRequest,
        headers: new Headers({ 'x-forwarded-for': '127.0.0.1' }),
      } as unknown as NextRequest;

      const request2 = {
        ...mockRequest,
        headers: new Headers({ 'x-forwarded-for': '127.0.0.2' }),
      } as unknown as NextRequest;

      // Both first requests should succeed
      await securityMiddleware(request1, { rateLimit: config });
      await securityMiddleware(request2, { rateLimit: config });
      expect(NextResponse.next).toHaveBeenCalledTimes(2);

      // Both second requests should be rate limited
      const response1 = await securityMiddleware(request1, { rateLimit: config });
      const response2 = await securityMiddleware(request2, { rateLimit: config });
      expect(response1.status).toBe(429);
      expect(response2.status).toBe(429);
    });
  });

  describe('Error Handling', () => {
    it('should handle internal errors gracefully', async () => {
      const request = {
        ...mockRequest,
        formData: jest.fn().mockRejectedValue(new Error('Internal error')),
      } as unknown as NextRequest;

      const response = await securityMiddleware(request, {
        csrfProtection: true,
        inputSanitization: true,
        fileUploadSecurity: true,
      });

      expect(response.status).toBe(500);
      expect(JSON.parse(await response.json())).toEqual({
        error: 'Internal server error',
      });
    });
  });
});