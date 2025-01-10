// src/lib/rate-limit.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitConfig {
  limit: number;
  windowMs: number;
  keyGenerator?: (request: NextRequest) => string;
  handler?: (request: NextRequest) => NextResponse | Promise<NextResponse>;
  skipFailedRequests?: boolean;
  skipSuccessfulRequests?: boolean;
}

export const getRateLimitMiddleware = (config: RateLimitConfig) => {
  const limiter = new RateLimit(config);
  return (request: NextRequest) => limiter.middleware(request);
};

export class RateLimit {
  private cache: Map<string, { count: number; resetTime: number }>;
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.cache = new Map();
    this.config = {
      keyGenerator: (request: NextRequest) => 
        request.headers.get('x-forwarded-for') || 
        request.headers.get('x-real-ip') || 
        '127.0.0.1',
      handler: () => 
        NextResponse.json(
          { error: 'Too many requests, please try again later.' },
          { status: 429 }
        ),
      skipFailedRequests: false,
      skipSuccessfulRequests: false,
      ...config,
    };
  }

  check(request: NextRequest): { success: boolean; remainingRequests: number; resetTime: number } {
    const key = this.config.keyGenerator!(request);
    const now = Date.now();
    const record = this.cache.get(key);

    if (!record) {
      this.cache.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return { success: true, remainingRequests: this.config.limit - 1, resetTime: now + this.config.windowMs };
    }

    if (now > record.resetTime) {
      record.count = 1;
      record.resetTime = now + this.config.windowMs;
      this.cache.set(key, record);
      return { success: true, remainingRequests: this.config.limit - 1, resetTime: record.resetTime };
    }

    if (record.count >= this.config.limit) {
      return { success: false, remainingRequests: 0, resetTime: record.resetTime };
    }

    record.count += 1;
    this.cache.set(key, record);
    return { 
      success: true, 
      remainingRequests: this.config.limit - record.count,
      resetTime: record.resetTime 
    };
  }

  async middleware(request: NextRequest) {
    const check = this.check(request);

    if (!check.success) {
      const response = await this.config.handler!(request);
      response.headers.set('Retry-After', Math.ceil((check.resetTime - Date.now()) / 1000).toString());
      response.headers.set('X-RateLimit-Limit', this.config.limit.toString());
      response.headers.set('X-RateLimit-Remaining', check.remainingRequests.toString());
      response.headers.set('X-RateLimit-Reset', Math.ceil(check.resetTime / 1000).toString());
      return response;
    }

    const response = NextResponse.next();
    response.headers.set('X-RateLimit-Limit', this.config.limit.toString());
    response.headers.set('X-RateLimit-Remaining', check.remainingRequests.toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil(check.resetTime / 1000).toString());
    return response;
  }
}

// Export a pre-configured instance for API routes
export const apiRateLimit = new RateLimit({
  limit: 100,
  windowMs: 15 * 60 * 1000, // 15 minutes
});