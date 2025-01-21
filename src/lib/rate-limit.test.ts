// src/lib/rate-limit.test.ts

import { apiRateLimit } from './rate-limit';
import { NextResponse } from 'next/server';

describe('Rate Limiter', () => {
  beforeEach(() => {
    // Clear rate limiter state between tests
    jest.clearAllMocks();
  });

  it('should allow requests within rate limit', async () => {
    const config = {
      maxRequests: 5,
      windowMs: 1000 // 1 second window
    };

    const response = await apiRateLimit('127.0.0.1', config);
    expect(response).toBeNull(); // Null response means request is allowed
  });

  it('should block requests exceeding rate limit', async () => {
    const config = {
      maxRequests: 2,
      windowMs: 1000
    };

    // Make multiple requests
    await apiRateLimit('127.0.0.1', config);
    await apiRateLimit('127.0.0.1', config);
    const response = await apiRateLimit('127.0.0.1', config);

    expect(response).toBeInstanceOf(NextResponse);
    expect(response?.status).toBe(429);
  });

  it('should handle different IPs separately', async () => {
    const config = {
      maxRequests: 2,
      windowMs: 1000
    };

    // Exhaust limit for first IP
    await apiRateLimit('127.0.0.1', config);
    await apiRateLimit('127.0.0.1', config);
    const blockedResponse = await apiRateLimit('127.0.0.1', config);

    // Different IP should still be allowed
    const allowedResponse = await apiRateLimit('127.0.0.2', config);

    expect(blockedResponse?.status).toBe(429);
    expect(allowedResponse).toBeNull();
  });

  it('should reset rate limit after window expires', async () => {
    jest.useFakeTimers();
    
    const config = {
      maxRequests: 2,
      windowMs: 1000
    };

    // Exhaust limit
    await apiRateLimit('127.0.0.1', config);
    await apiRateLimit('127.0.0.1', config);
    const blockedResponse = await apiRateLimit('127.0.0.1', config);
    expect(blockedResponse?.status).toBe(429);

    // Advance time beyond window
    jest.advanceTimersByTime(1100);

    // Should be allowed again
    const allowedResponse = await apiRateLimit('127.0.0.1', config);
    expect(allowedResponse).toBeNull();

    jest.useRealTimers();
  });

  it('should include proper headers in rate limit response', async () => {
    const config = {
      maxRequests: 1,
      windowMs: 1000
    };

    await apiRateLimit('127.0.0.1', config);
    const response = await apiRateLimit('127.0.0.1', config);

    expect(response?.headers.get('Retry-After')).toBeDefined();
    expect(JSON.parse(await response?.json())).toHaveProperty('retryAfter');
  });

  it('should use default config when none provided', async () => {
    // Make many requests without config
    const responses = await Promise.all(
      Array(101).fill(null).map(() => apiRateLimit('127.0.0.1'))
    );

    // 101st request should be blocked (default is 100 requests per window)
    expect(responses[100]?.status).toBe(429);
  });
});