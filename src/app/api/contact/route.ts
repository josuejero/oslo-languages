import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { mkdir } from 'fs/promises';
import { getRateLimitMiddleware } from '@/lib/rate-limit';
import { logger } from '@/lib/logger';

const rateLimitMiddleware = getRateLimitMiddleware({
  limit: 5,
  windowMs: 60 * 1000,
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png'
];

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const rateLimitResponse = await rateLimitMiddleware(request);
    if (rateLimitResponse) {
      logger.warn('Rate limit exceeded', {
        ip: request.headers.get('x-forwarded-for'),
        path: request.url,
      });
      return rateLimitResponse;
    }

    // Ensure upload directory exists
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (error) {
      logger.error('Failed to create upload directory', { error });
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Parse form data
    const formData = await request.formData();
    const files = formData.getAll('attachments') as File[];
    
    // Validate files
    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 5MB` },
          { status: 400 }
        );
      }

      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: `File type ${file.type} is not allowed` },
          { status: 400 }
        );
      }
    }

    // Process form data
    const data = {
      name: formData.get('name')?.toString().trim(),
      email: formData.get('email')?.toString().trim(),
      subject: formData.get('subject')?.toString().trim(),
      message: formData.get('message')?.toString().trim(),
      attachments: [] as string[],
    };

    // Validate required fields
    const errors: string[] = [];
    if (!data.name) errors.push('Name is required');
    if (!data.email) errors.push('Email is required');
    if (!data.subject) errors.push('Subject is required');
    if (!data.message) errors.push('Message is required');

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Invalid email address');
    }

    // Return validation errors if any
    if (errors.length > 0) {
      logger.warn('Contact form validation failed', { errors, data });
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Save files
    const savedFiles = [];
    for (const file of files) {
      try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        
        // Generate unique filename
        const timestamp = Date.now();
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${safeFilename}`;
        const filepath = join(UPLOAD_DIR, filename);
        
        await writeFile(filepath, buffer);
        savedFiles.push(filename);
        
        logger.info('File saved successfully', { 
          filename,
          size: file.size,
          type: file.type 
        });
      } catch (error) {
        logger.error('File save failed', { 
          filename: file.name,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return NextResponse.json(
          { error: `Failed to save file ${file.name}` },
          { status: 500 }
        );
      }
    }

    // Update data with saved file information
    data.attachments = savedFiles;

    // Log the submission
    logger.info('Processing contact form submission', {
      email: data.email,
      subject: data.subject,
      attachments: savedFiles.length
    });

    // Here you would typically:
    // 1. Send notification email
    // 2. Store in database
    // 3. Process attachments as needed

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your message. We will contact you soon.',
        data: {
          ...data,
          attachments: savedFiles.map(file => `/uploads/${file}`)
        }
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
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process your request. Please try again later.',
      },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Methods': 'POST',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    },
  });
}