// src/utils/index.ts
import { NextResponse } from 'next/server';
import { Metadata } from 'next';

/**
 * API Response Helpers
 * Standardized functions for API responses to ensure consistent
 * error and success handling across all API endpoints
 */

/**
 * Creates a standardized error response for API endpoints
 * @param message - Error message to display
 * @param status - HTTP status code (defaults to 400 Bad Request)
 * @returns NextResponse with error details and appropriate status
 */
export function errorResponse(message: string, status = 400) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

/**
 * Creates a standardized success response for API endpoints
 * @param data - Response data to return
 * @param status - HTTP status code (defaults to 200 OK)
 * @returns NextResponse with data and appropriate status
 */
export function successResponse(data: any, status = 200) {
  return NextResponse.json(
    data,
    { status }
  );
}

/**
 * Metadata Generation
 * Helpers for creating consistent page metadata across the site
 */

/**
 * Creates standardized metadata for pages
 * @param title - Page title (will be appended with site name)
 * @param description - Page meta description
 * @param includeAppName - Whether to append "| Oslo Languages" (default true)
 * @returns Metadata object compatible with Next.js Metadata API
 */
export function createMetadata(
  title: string,
  description: string,
  includeAppName = true
): Metadata {
  return {
    title: includeAppName ? `${title} | Oslo Languages` : title,
    description,
  };
}

/**
 * Form Validation
 * Utility functions for validating form inputs
 */

/**
 * Validates an email address format
 * @param email - Email address to validate
 * @returns Boolean indicating if the email format is valid
 */
export function validateEmail(email: string): boolean {
  return /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);
}

/**
 * Validates that a string has minimum required length
 * @param value - String to validate
 * @param minLength - Minimum required length
 * @returns Boolean indicating if the string meets length requirements
 */
export function validateMinLength(value: string, minLength: number): boolean {
  return value.trim().length >= minLength;
}

/**
 * Validates form fields with common validation rules
 * @param data - Object containing form field values
 * @returns Object with validation errors (empty if valid)
 */
export function validateContactForm(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  const errors: Record<string, string> = {};

  if (!validateMinLength(data.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (!validateEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!validateMinLength(data.subject, 3)) {
    errors.subject = 'Subject must be at least 3 characters';
  }

  if (!validateMinLength(data.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
}

/**
 * Date Formatting
 * Utility functions for consistent date formatting
 */

/**
 * Formats a date string into a localized readable format
 * @param dateString - ISO date string or Date object
 * @param locale - Locale code (defaults to 'en-US')
 * @returns Formatted date string (e.g., "April 1, 2025")
 */
export function formatDate(
  dateString: string | Date,
  locale = 'en-US'
): string {
  const date = typeof dateString === 'string' 
    ? new Date(dateString) 
    : dateString;
  
  return date.toLocaleDateString(locale, { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

/**
 * Creates a relative time string (e.g., "2 days ago")
 * @param dateString - ISO date string or Date object
 * @returns String with relative time description
 */
export function getRelativeTimeString(dateString: string | Date): string {
  const date = typeof dateString === 'string' 
    ? new Date(dateString) 
    : dateString;
  
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Yesterday';
  } else if (diffDays < 7) {
    return `${diffDays} days ago`;
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
  } else {
    return formatDate(date);
  }
}