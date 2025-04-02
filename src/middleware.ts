// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Add detailed logging to identify potential middleware issues
export function middleware(request: NextRequest) {
  console.log('middleware: Processing request for', request.url);
  
  // Completely disable all middleware functionality temporarily
  return NextResponse.next();
}

// Reduce the matcher scope to avoid potential routing issues
export const config = {
  matcher: [], // Empty array to disable middleware completely
};