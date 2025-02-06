// src/app/api/blog/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as blogOps from '@/utils/blog-operations';
import { logger } from '@/utils/logger';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  try {
    const results = await blogOps.searchPosts({
      query: searchParams.get('q') || undefined,
      category: searchParams.get('category') || undefined,
      tag: searchParams.get('tag') || undefined,
      status: searchParams.get('status') as 'draft' | 'published' | undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
    });

    return NextResponse.json(results);
  } catch (err) {
    logger.error('Failed to search posts', {
      error: err instanceof Error ? err.message : 'Unknown error'
    });
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}