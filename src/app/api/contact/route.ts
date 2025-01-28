import { NextRequest, NextResponse } from 'next/server';
import { handleApiRoute, validators, ApiError } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  return handleApiRoute(request, handleContact, {
    validations: {
      name: validators.required('Name') as (value: unknown) => string | boolean,
      email: validators.email() as (value: unknown) => string | boolean,
      subject: validators.required('Subject') as (value: unknown) => string | boolean,
      message: validators.required('Message') as (value: unknown) => string | boolean,
    }
  });
}

async function handleContact(request: NextRequest) {
  try {
    const data = await request.json();

    // Process form data
    const formData = {
      name: data.name?.toString().trim(),
      email: data.email?.toString().trim(),
      subject: data.subject?.toString().trim(),
      message: data.message?.toString().trim(),
    };

    // Here you would typically:
    // 1. Send notification email
    // 2. Store in database
    // 3. Log the submission

    logger.info('Contact form submission processed', {
      email: formData.email,
      subject: formData.subject
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will contact you soon.',
        data: formData
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate'
        }
      }
    );
  } catch (error) {
    logger.error('Contact form submission failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    throw new ApiError('Failed to process contact form submission', 500);
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    },
  });
}