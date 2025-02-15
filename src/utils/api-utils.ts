// src/utils/api-utils.ts

import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

/**
 * Generic API error class with typed status codes.
 */
export class ApiError extends Error {
  /**
   * Creates an instance of ApiError.
   * @param message - Error message
   * @param statusCode - HTTP status code (default: 400)
   * @param data - Optional additional error data
   */
  constructor(
    message: string, 
    public statusCode: number = 400,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Validates request data based on provided validators.
 * @param data - The data to validate
 * @param validations - A record mapping each field to its validator function
 * @returns An array of error objects containing the field and error message, if any
 */
export function validateRequest<T>(
  data: T,
  validations: Record<keyof T, (value: unknown) => boolean | string>
): Array<{ field: keyof T; message: string }> {
  return Object.entries(validations)
    .map(([field, validator]) => {
      // Cast validator to proper function type to resolve TS18046 error
      const validateFn = validator as (value: unknown) => boolean | string;
      const result = validateFn(data[field as keyof T]);
      return result === true ? null : { field: field as keyof T, message: result || `Invalid ${field}` };
    })
    .filter((error): error is { field: keyof T; message: string } => error !== null);
}

/**
 * Unified API route handler that wraps API logic with error handling and validations.
 * @param req - The NextRequest object
 * @param handler - The async function handling the specific route logic, expected to return a NextResponse
 * @param options - Optional configuration including validations and authentication requirement
 * @returns A NextResponse based on the result of the handler or error handling
 */
export async function handleApiRoute(
  req: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  options: {
    validations?: Record<string, (value: unknown) => boolean | string>;
    requireAuth?: boolean;
  } = {}
) {
  try {
    // Parse request body for non-GET requests
    let body: Record<string, unknown> | undefined;
    if (!['GET', 'HEAD'].includes(req.method)) {
      const contentType = req.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        body = await req.json();
      }
    }

    // Validate request if validations provided
    if (options.validations && body) {
      const errors = validateRequest(body, options.validations);
      if (errors.length > 0) {
        logger.error('Validation failed:', { errors });
        return NextResponse.json({ success: false, errors }, { status: 400 });
      }
    }

    // Handle the request using the provided handler
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

/**
 * Common validation functions.
 */
export const validators = {
  /**
   * Validator to check that a value is provided.
   * @param field - The field name for error messaging
   * @returns A function that returns true if valid or an error message if not
   */
  required: (field: string) => (value: unknown): boolean | string =>
    value ? true : `${field} is required`,

  /**
   * Validator to check that a value is a valid email.
   * @returns A function that returns true if the email is valid or an error message if not
   */
  email: () => (value: unknown): boolean | string => {
    // Ensure the value is a string before testing
    if (typeof value !== 'string') {
      return 'Invalid email address';
    }
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(value) ? true : 'Invalid email address';
  },

  /**
   * Validator to ensure a string meets a minimum length.
   * @param min - The minimum length required
   * @returns A function that returns true if valid or an error message if not
   */
  minLength: (min: number) => (value: unknown): boolean | string => {
    // Check that the value is a string before applying length logic
    if (typeof value !== 'string') {
      return `Must be at least ${min} characters`;
    }
    return value.length >= min ? true : `Must be at least ${min} characters`;
  },
};
