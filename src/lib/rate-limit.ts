// src/lib/rate-limit.ts
import { RateLimiter } from 'limiter';
import { NextResponse } from 'next/server';

// Create a limiter that allows 100 requests per 15 minutes
const limiter = new RateLimiter({
  tokensPerInterval: 100,
  interval: 900000,
  fireImmediately: true
});

export async function getRateLimitMiddleware() {
  const remaining = await limiter.tryRemoveTokens(1);
  
  if (!remaining) {
    return NextResponse.json(
      { error: 'Too many requests, please try again later.' },
      { 
        status: 429,
        headers: {
          'Retry-After': '900' // 15 minutes in seconds
        }
      }
    );
  }

  return null;
}

// Export a pre-configured instance for API routes
export const apiRateLimit = {
  check: async () => {
    return getRateLimitMiddleware();
  }
};