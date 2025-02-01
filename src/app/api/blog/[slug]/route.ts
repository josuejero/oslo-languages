// src/app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import * as blogOps from '@/lib/blog/operations';
import { logger } from '@/lib/logger';

interface RouteParams {
  params: { slug: string }
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const post = await blogOps.getPostBySlug(params.slug);
    
    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ post });
  } catch (error) {
    logger.error('Failed to get post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug: params.slug
    });

    return NextResponse.json(
      { error: 'Failed to get post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const updates = await request.json();
    const post = await blogOps.updatePost(params.slug, updates);

    logger.info('Post updated successfully', {
      slug: params.slug
    });
    return NextResponse.json({ post });
  } catch (error) {
    logger.error('Failed to update post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug: params.slug
    });

    return NextResponse.json(
      { error: 'Failed to update post' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: RouteParams
) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    await blogOps.deletePost(params.slug);

    logger.info('Post deleted successfully', {
      slug: params.slug
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      slug: params.slug
    });

    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}