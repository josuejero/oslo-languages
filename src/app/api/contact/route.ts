// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { handleApiRoute, validators } from '@/lib/api-utils';
import { sendEmail, validateEmailConfig, EmailError } from '@/lib/email';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  return handleApiRoute(request, handleContact, {
    validations: {
      name: validators.required('Name'),
      email: validators.email() as (value: unknown) => string | boolean,
      subject: validators.required('Subject'),
      message: validators.required('Message')
    }
  });
}

async function handleContact(request: NextRequest) {
  try {
    // Validate email configuration first
    const isConfigValid = await validateEmailConfig();
    if (!isConfigValid) {
      throw new EmailError('Email service not properly configured', 'CONFIG_ERROR');
    }

    // Get form data
    const data = await request.json();
    
    // Process form data
    const formData = {
      name: data.name?.toString().trim(),
      email: data.email?.toString().trim(),
      subject: data.subject?.toString().trim(),
      message: data.message?.toString().trim(),
    };

    // Send notification email to admin
    await sendEmail('contact', formData);

    // Send confirmation email to user
    await sendEmail('confirmation', formData);

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

    // Handle specific email errors
    if (error instanceof EmailError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to process your message. Please try again later.',
          code: error.code
        },
        { status: error.code === 'CONFIG_ERROR' ? 500 : 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process your message. Please try again later.'
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      status: 204,
      headers: {
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Max-Age': '86400'
      },
    }
  );
}