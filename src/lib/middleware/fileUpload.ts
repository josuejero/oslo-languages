// src/lib/middleware/fileUpload.ts
import { NextRequest } from 'next/server';
import { logger } from '../logger';
import crypto from 'crypto';
import path from 'path';

interface FileValidationConfig {
  maxSize: number;
  allowedTypes: string[];
  maxFiles?: number;
  minSize?: number;
  scanForVirus?: boolean;
}

const defaultConfig: FileValidationConfig = {
  maxSize: 5 * 1024 * 1024, // 5MB
  minSize: 1024, // 1KB
  allowedTypes: [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ],
  maxFiles: 5,
  scanForVirus: true
};

export class FileValidationError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = 'FileValidationError';
  }
}

export async function validateFile(
  file: File,
  config: Partial<FileValidationConfig> = {}
): Promise<void> {
  const finalConfig = { ...defaultConfig, ...config };

  // Check file size
  if (file.size > finalConfig.maxSize) {
    throw new FileValidationError(
      `File size exceeds ${finalConfig.maxSize} bytes`,
      'FILE_TOO_LARGE',
      413
    );
  }

  if (file.size < finalConfig.minSize!) {
    throw new FileValidationError(
      `File size below ${finalConfig.minSize} bytes`,
      'FILE_TOO_SMALL'
    );
  }

  // Validate MIME type
  if (!finalConfig.allowedTypes.includes(file.type)) {
    throw new FileValidationError(
      `File type ${file.type} not allowed`,
      'INVALID_FILE_TYPE'
    );
  }

  // Validate file extension
  const extension = path.extname(file.name).toLowerCase();
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.pdf', '.doc', '.docx'];
  if (!allowedExtensions.includes(extension)) {
    throw new FileValidationError(
      `File extension ${extension} not allowed`,
      'INVALID_FILE_EXTENSION'
    );
  }

  // Calculate file hash for integrity
  const arrayBuffer = await file.arrayBuffer();
  const hash = crypto
    .createHash('sha256')
    .update(Buffer.from(arrayBuffer))
    .digest('hex');

  // Basic header check for common file types
  const buffer = Buffer.from(arrayBuffer);
  const fileSignature = buffer.slice(0, 4).toString('hex');

  const signatures: { [key: string]: string[] } = {
    'image/jpeg': ['ffd8ffe0', 'ffd8ffe1'],
    'image/png': ['89504e47'],
    'application/pdf': ['25504446'],
  };

  if (signatures[file.type] && !signatures[file.type].includes(fileSignature)) {
    throw new FileValidationError(
      'File content does not match its extension',
      'INVALID_FILE_CONTENT'
    );
  }

  // TODO: Implement virus scanning if enabled
  if (finalConfig.scanForVirus) {
    // Implement virus scanning here
    // This would typically involve integrating with a virus scanning service
    logger.info('Virus scanning would occur here', { fileHash: hash });
  }
}

export async function validateFiles(
  files: File[],
  config: Partial<FileValidationConfig> = {}
): Promise<void> {
  const finalConfig = { ...defaultConfig, ...config };

  // Check number of files
  if (finalConfig.maxFiles && files.length > finalConfig.maxFiles) {
    throw new FileValidationError(
      `Number of files exceeds maximum of ${finalConfig.maxFiles}`,
      'TOO_MANY_FILES'
    );
  }

  // Validate each file
  await Promise.all(files.map(file => validateFile(file, config)));
}

export async function fileUploadMiddleware(request: NextRequest): Promise<NextRequest> {
  if (!['POST', 'PUT', 'PATCH'].includes(request.method)) {
    return request;
  }

  const contentType = request.headers.get('content-type');
  if (!contentType?.includes('multipart/form-data')) {
    return request;
  }

  try {
    const formData = await request.formData();
    const files: File[] = [];

    for (const [, value] of formData.entries()) {
      if (value instanceof File) {
        files.push(value);
      }
    }

    await validateFiles(files);

    // Create new FormData with validated files
    const validatedFormData = new FormData();
    for (const [key, value] of formData.entries()) {
      if (value instanceof File) {
        // Generate a secure filename
        const extension = path.extname(value.name);
        const safeFilename = `${crypto.randomBytes(16).toString('hex')}${extension}`;
        
        validatedFormData.append(
          key,
          new File([value], safeFilename, { type: value.type })
        );
      } else {
        validatedFormData.append(key, value);
      }
    }

    // Create new request with validated FormData
    return new Request(request.url, {
      method: request.method,
      headers: request.headers,
      body: validatedFormData
    }) as NextRequest;

  } catch (error) {
    if (error instanceof FileValidationError) {
      logger.warn('File validation failed:', { error });
      throw error;
    }
    logger.error('File upload error:', { error });
    throw new FileValidationError(
      'File upload failed',
      'UPLOAD_ERROR',
      500
    );
  }
}
// Helper to get safe file path
export function getSafeFilePath(filename: string, uploadDir: string): string {
  const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9._-]/g, '_');
  return path.join(uploadDir, safeFilename);
}

// Helper to generate unique filename
export function generateUniqueFilename(originalFilename: string): string {
  const extension = path.extname(originalFilename);
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${random}${extension}`;
}