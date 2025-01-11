import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

export class ApiError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}


export function validateRequest(
  data: Record<string, unknown>,
  validations: Record<string, (value: unknown) => boolean | string>
) {
  return Object.entries(validations)
    .map(([field, validator]) => {
      const result = validator(data[field]);
      return result === true ? null : { field, message: result || `Invalid ${field}` };
    })
    .filter((error): error is { field: string; message: string } => error !== null);
}

export async function handleApiRoute(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    validations?: Record<string, (value: unknown) => boolean | string>;
  } = {}
) {
  try {
    // Parse body if it exists
    let body: Record<string, unknown> | undefined;
    if (!['GET', 'HEAD'].includes(req.method)) {
      const contentType = req.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await req.json();
      }
    }

    // Validate request if validations are provided
    if (options.validations && body) {
      const errors = validateRequest(body, options.validations);
      if (errors.length > 0) {
        logger.error('Validation failed:', { errors });
        return NextResponse.json({ success: false, errors }, { status: 400 });
      }
    }

    // Handle the request
    const response = await handler(req);
    return response;

  } catch (error) {
    logger.error('API Error:', {
      path: req.url,
      method: req.method,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}




// Common validation functions
export const validators = {
  required: (field: string) => (value: unknown): boolean | string => 
    value ? true : `${field} is required`,
    
  email: () => (value: string): boolean | string => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) ? true : 'Invalid email address';
  },

  phone: () => (value: string): boolean | string => {
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return phoneRegex.test(value) ? true : 'Invalid phone number';
  },

  maxLength: (max: number) => (value: string): boolean | string =>
    value.length <= max ? true : `Must be ${max} characters or less`,

  minLength: (min: number) => (value: string): boolean | string =>
    value.length >= min ? true : `Must be at least ${min} characters`,
};