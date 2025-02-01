// src/app/api/blog/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import * as blogOps from '@/lib/blog/operations';
import { logger } from '@/lib/logger';
import { BlogError } from '@/lib/blog/operations';

// POST /api/blog/preview - Preview post content
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content } = await request.json();
    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    const html = await blogOps.previewPost(content);
    return NextResponse.json({ html });
  } catch (error) {
    logger.error('Failed to generate preview', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    if (error instanceof BlogError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode }
      );
    }

    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}