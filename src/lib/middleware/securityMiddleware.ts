// src/lib/middleware/securityMiddleware.ts

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { logger } from '../logger';
import { apiRateLimit } from '../rate-limit';



// CSRF Configuration
const CSRF_SECRET = process.env.CSRF_SECRET || crypto.randomBytes(32).toString('hex');
const CSRF_SALT = process.env.CSRF_SALT || crypto.randomBytes(16).toString('hex');
const CSRF_TOKEN_EXPIRY = 4 * 60 * 60 * 1000; // 4 hours




// Content Security Configuration
const ALLOWED_FILE_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
]);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const SAFE_FILE_REGEX = /^[a-zA-Z0-9_-]+\.[a-zA-Z0-9]+$/;

interface SecurityConfig {
  csrfProtection?: boolean;
  inputSanitization?: boolean;
  fileUploadSecurity?: boolean;
  rateLimit?: {
    maxRequests: number;
    windowMs: number;
  };
}

// CSRF Token Generation and Validation
export function generateCSRFToken(sessionId: string): { token: string; expires: number } {
  const expires = Date.now() + CSRF_TOKEN_EXPIRY;
  const payload = `${sessionId}${expires}${CSRF_SALT}`;
  const token = crypto
    .createHmac('sha256', CSRF_SECRET)
    .update(payload)
    .digest('hex');

  return { token, expires };
}

function validateCSRFToken(token: string, sessionId: string): boolean {
  try {
    const [providedToken, expiresStr] = token.split('.');
    const expires = parseInt(expiresStr, 10);

    if (isNaN(expires) || Date.now() > expires) {
      return false;
    }

    const expectedToken = generateCSRFToken(sessionId).token;
    return crypto.timingSafeEqual(
      Buffer.from(providedToken),
      Buffer.from(expectedToken)
    );
  } catch (error) {
    logger.error('CSRF validation error:', { error });
    return false;
  }
}

// Input Sanitization

function sanitizeInput(input: unknown): string | unknown {
  if (typeof input === 'string') {
    // Remove potential XSS vectors
    return input
      .replace(/[<>]/g, '')  // Remove < and >
      .replace(/javascript:/gi, '')  // Remove javascript: protocol
      .replace(/data:/gi, '')  // Remove data: protocol
      .replace(/on\w+=/gi, '')  // Remove event handlers
      .trim();
  }

  if (Array.isArray(input)) {
    return input.map(item => sanitizeInput(item));
  }

  if (input && typeof input === 'object') {
    return Object.fromEntries(
      Object.entries(input).map(([key, value]) => [
        sanitizeInput(key),
        sanitizeInput(value)
      ])
    );
  }

  return input;
}

// File Upload Security
interface FileValidationResult {
  isValid: boolean;
  error?: string;
  generatedFilename?: string;
}

function validateFile(file: File): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    };
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.has(file.type)) {
    return {
      isValid: false,
      error: 'File type not allowed'
    };
  }

  // Validate filename
  if (!SAFE_FILE_REGEX.test(file.name)) {
    return {
      isValid: false,
      error: 'Invalid filename'
    };
  }

  return { isValid: true };
}

async function validateFileContent(file: File): Promise<FileValidationResult> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Check file signature (magic numbers)
    const fileSignature = buffer.slice(0, 4).toString('hex');
    
    const signatures: { [key: string]: string[] } = {
      'image/jpeg': ['ffd8ffe0', 'ffd8ffe1', 'ffd8ffe2'],
      'image/png': ['89504e47'],
      'application/pdf': ['25504446'],
    };

    if (signatures[file.type] && !signatures[file.type].includes(fileSignature)) {
      return {
        isValid: false,
        error: 'File content does not match its extension'
      };
    }

    // Generate safe filename
    const ext = file.name.split('.').pop()?.toLowerCase();

    const generatedFilename = `${crypto.randomBytes(16).toString('hex')}.${ext}`;

    // Return success with safe filename
    return {
      isValid: true,

      generatedFilename
    };
  } catch (error) {
    logger.error('File content validation error:', { error });
    return {
      isValid: false,
      error: 'Failed to validate file content'
    };
  }
}

// Main Security Middleware
export async function securityMiddleware(
  request: NextRequest,
  config: SecurityConfig = {}
): Promise<NextResponse> {
  try {
    // 1. Rate Limiting
    if (config.rateLimit) {
      const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
      const rateLimitResult = await apiRateLimit(clientIp, config.rateLimit);
      if (rateLimitResult instanceof NextResponse) {
        return rateLimitResult;
      }
    }

    // 2. CSRF Protection
    if (config.csrfProtection && !['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
      const sessionId = request.cookies.get('sessionId')?.value;
      const csrfToken = request.headers.get('X-CSRF-Token');

      if (!sessionId || !csrfToken || !validateCSRFToken(csrfToken, sessionId)) {
        return new NextResponse(
          JSON.stringify({ error: 'Invalid CSRF token' }),
          { status: 403 }
        );
      }
    }

    // 3. Input Sanitization
    if (config.inputSanitization && request.body) {
      const contentType = request.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        const body = await request.json();
        const sanitizedBody = sanitizeInput(body);
        
        // Create new request with sanitized body

        const newRequest = new NextRequest(request.url, {
          method: request.method,
          headers: request.headers,
          body: JSON.stringify(sanitizedBody)
        });
        return NextResponse.next({ request: newRequest });
      }

      if (contentType?.includes('multipart/form-data')) {
        const formData = await request.formData();
        const sanitizedFormData = new FormData();

        for (const [key, value] of formData.entries()) {
          if (value instanceof File) {
            // Validate file
            const fileValidation = await validateFile(value);
            if (!fileValidation.isValid) {
              return new NextResponse(
                JSON.stringify({ error: fileValidation.error }),
                { status: 400 }
              );
            }

            // Validate file content
            const contentValidation = await validateFileContent(value);
            if (!contentValidation.isValid) {
              return new NextResponse(
                JSON.stringify({ error: contentValidation.error }),
                { status: 400 }
              );
            }

            sanitizedFormData.append(key, value);
          } else {

            sanitizedFormData.append(key, sanitizeInput(value.toString()) as string);
          }
        }

        // Create new request with sanitized form data

        const newRequest = new NextRequest(request.url, {
          method: request.method,
          headers: request.headers,
          body: sanitizedFormData
        });
        return NextResponse.next({ request: newRequest });
      }
    }



    // If no modifications needed, continue with original request
    return NextResponse.next();

  } catch (error) {
    logger.error('Security middleware error:', { error });
    return new NextResponse(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500 }
    );
  }
}