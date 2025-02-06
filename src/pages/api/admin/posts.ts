import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import * as blogOps from '@/utils/blog-operations';
import { logger } from '@/utils/logger';

export async function POST(request: NextRequest) {
  const session = await getServerSession();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const post = await blogOps.createPost({
      ...data,
      author: session.user.email,
    });

    logger.info('Post created successfully', { postId: post.id });
    return NextResponse.json({ post });
  } catch (error) {
    logger.error('Failed to create post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: session.user.email
    });
    return NextResponse.json(
      { error: 'Failed to create post' },
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

    logger.info('Post updated successfully', { 
      postId: post.id,
      slug 
    });
    return NextResponse.json({ post });
  } catch (error) {
    logger.error('Failed to update post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: session.user.email
    });
    return NextResponse.json(
      { error: 'Failed to update post' },
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

    logger.info('Post deleted successfully', { 
      slug,
      user: session.user.email 
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to delete post', {
      error: error instanceof Error ? error.message : 'Unknown error',
      user: session.user.email
    });
    return NextResponse.json(
      { error: 'Failed to delete post' },
      { status: 500 }
    );
  }
}