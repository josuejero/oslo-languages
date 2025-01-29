// src/app/api/blog/preview/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as blogOps from '@/lib/blog/operations';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { content } = await request.json();
    const html = await blogOps.previewPost(content);
    return NextResponse.json({ html });
  } catch (err) {
    logger.error('Failed to generate preview', { 
      error: err instanceof Error ? err.message : 'Unknown error' 
    });
    return NextResponse.json(
      { error: 'Failed to generate preview' },
      { status: 500 }
    );
  }
}