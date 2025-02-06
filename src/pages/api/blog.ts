// src/app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as blogOps from '@/utils/blog-operations';
import { getServerSession } from 'next-auth';
import { logger } from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') as 'draft' | 'published' | undefined;
    const sortBy = searchParams.get('sortBy') as 'date' | 'title' | undefined;
    const sortOrder = searchParams.get('sortOrder') as 'asc' | 'desc' | undefined;

    const results = await blogOps.searchPosts({
      status,
      sortBy,
      sortOrder
    });

    return NextResponse.json(results);
  } catch (error) {
    logger.error('Failed to get posts', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to get posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const post = await blogOps.createPost({
      ...data,
      author: session.user.email || 'Anonymous'
    });

    return NextResponse.json({ post });
  } catch (error) {
    logger.error('Failed to create post', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await request.json();
    await blogOps.deletePost(slug);

    logger.info('Post deleted successfully', { slug });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete post', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug, ...updates } = await request.json();
    const post = await blogOps.updatePost(slug, updates);

    logger.info('Post updated successfully', { slug });
    return NextResponse.json({ post });
  } catch (error) {
    logger.error('Failed to update post', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}