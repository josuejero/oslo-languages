// src/app/api/admin/media/upload/route.ts
import { NextResponse } from 'next/server';
import { join } from 'path';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];
    const savedFiles = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File ${file.name} exceeds maximum size of 5MB` },
          { status: 400 }
        );
      }

      if (!file.type.startsWith('image/')) {
        return NextResponse.json(
          { error: `File ${file.name} is not an image` },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const image = sharp(buffer);
      const metadata = await image.metadata();

      const filename = `${uuidv4()}-${file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-')}`;
      const filepath = join(UPLOAD_DIR, filename);

      // Save optimized image
      await image
        .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80 })
        .toFile(filepath);

      savedFiles.push({
        id: uuidv4(),
        filename: file.name,
        path: `/uploads/${filename}`,
        mimeType: file.type,
        size: file.size,
        width: metadata.width,
        height: metadata.height,
        uploadedAt: new Date(),
        updatedAt: new Date(),
      });
    }

    return NextResponse.json({ files: savedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process upload' },
      { status: 500 }
    );
  }
}