import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { handleApiRoute, validators, ApiError } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

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
  // Ensure upload directory exists
  try {
    await mkdir(UPLOAD_DIR, { recursive: true });
  } catch (error) {
    logger.error('Failed to create upload directory', { error });
    throw new ApiError('Server configuration error', 500);
  }

  const formData = await request.formData();
  const files = formData.getAll('attachments') as File[];
  
  // Validate files
  for (const file of files) {
    if (file.size > MAX_FILE_SIZE) {
      throw new ApiError(`File ${file.name} exceeds maximum size of 5MB`, 400);
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new ApiError(`File type ${file.type} is not allowed`, 400);
    }
  }

  // Save files
  const savedFiles = [];
  for (const file of files) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
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
      throw new ApiError(`Failed to save file ${file.name}`, 500);
    }
  }

  // Process form data
  const data = {
    name: formData.get('name')?.toString().trim(),
    email: formData.get('email')?.toString().trim(),
    subject: formData.get('subject')?.toString().trim(),
    message: formData.get('message')?.toString().trim(),
    attachments: savedFiles,
  };

  // Here you would typically:
  // 1. Send notification email
  // 2. Store in database
  // 3. Process attachments as needed

  logger.info('Contact form submission processed', {
    email: data.email,
    subject: data.subject,
    attachments: savedFiles.length
  });

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