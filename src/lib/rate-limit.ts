// src/lib/rate-limit.ts

import { NextResponse } from 'next/server';
import { RateLimiter } from 'limiter';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

// Map to store RateLimiter instances per client IP
const rateLimiters: Map<string, RateLimiter> = new Map();

/**
 * Creates a rate limit middleware
 * @param clientIp - The IP address of the client
 * @param config - Rate limit configuration
 * @returns NextResponse if rate limit is exceeded, null otherwise
 */
export async function apiRateLimit(
  clientIp: string, 
  config: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000 // 15 minutes
  }
): Promise<NextResponse | null> {
  let limiter = rateLimiters.get(clientIp);

  // Initialize a new RateLimiter for the client if not present
  if (!limiter) {
    limiter = new RateLimiter({
      tokensPerInterval: config.maxRequests,
      interval: config.windowMs,
      fireImmediately: true
    });
    rateLimiters.set(clientIp, limiter);
  }

  // Attempt to remove a token (i.e., allow the request)
  const hasToken = await limiter.tryRemoveTokens(1);

  if (!hasToken) {
    const resetTime = limiter.getTokensRemaining() === 0 ? config.windowMs : 0;
    return NextResponse.json(
      { 
        error: 'Too many requests, please try again later.',
        retryAfter: Math.ceil(resetTime / 1000)
      },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.ceil(resetTime / 1000).toString()
        }
      }
    );
  }

  return null;
}