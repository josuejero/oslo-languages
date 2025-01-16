// src/lib/rate-limit.ts

import { RateLimiter } from 'limiter';

// Map to store RateLimiter instances per client IP
const rateLimiters: Map<string, RateLimiter> = new Map();

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

/**
 * Checks if the given client IP has exceeded the rate limit.
 * @param clientIp - The IP address of the client.
 * @param config - Rate limit configuration.
 * @returns An object indicating whether the request is allowed.
 */
export async function apiRateLimit(clientIp: string, config: RateLimitConfig): Promise<{ success: boolean }> {
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
  const remaining = await limiter.tryRemoveTokens(1);

  if (!remaining) {
    return { success: false };
  }

  return { success: true };
}
