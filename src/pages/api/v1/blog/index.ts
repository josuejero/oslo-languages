import { NextRequest, NextResponse } from 'next/server';
import { handleApiRoute, validators, ApiError } from '@/utils/api-utils';
import {
  getPostBySlug,
  updatePost,
  deletePost,
  previewContent,
  searchPosts,
  getAllPosts,
  BlogError
} from '@/modules/blog/operations';
import { logger } from '@/utils/logger';
import { getServerSession } from 'next-auth';

const validations = {
  title: validators.required('title'),
  content: validators.minLength(10)
};

export async function handler(req: NextRequest) {
  const url = new URL(req.url);
  const action = url.searchParams.get('action');
  const slug = url.searchParams.get('slug');

  if (req.method === 'GET') {
    if (action === 'search') {
      // Handle blog search
      try {
        const query = url.searchParams.get('query') || '';
        const category = url.searchParams.get('category') || undefined;
        const tag = url.searchParams.get('tag') || undefined;
        const page = Number(url.searchParams.get('page') || '1');
        const limit = Number(url.searchParams.get('limit') || '6');
        const sortBy = url.searchParams.get('sortBy') || 'date';
        const sortOrder = url.searchParams.get('sortOrder') || 'desc';

        const result = await searchPosts({
          query,
          category,
          tag,
          page,
          limit,
          sortBy: sortBy as 'date' | 'title',
          sortOrder: sortOrder as 'asc' | 'desc'
        });
        return NextResponse.json(result);
      } catch (error) {
        logger.error('Blog search error:', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return NextResponse.json({ error: 'Failed to search posts' }, { status: 500 });
      }
    } else if (action === 'tags') {
      // Return aggregated blog tags
      try {
        const posts = await getAllPosts();
        const tags = posts.reduce((acc, post) => {
          post.tags.forEach((tag: string) => {
            const tagSlug = tag.toLowerCase().replace(/\s+/g, '-');
            acc[tagSlug] = acc[tagSlug] || { name: tag, count: 0, slug: tagSlug };
            acc[tagSlug].count++;
          });
          return acc;
        }, {} as Record<string, { name: string; count: number; slug: string }>);
        return NextResponse.json(Object.values(tags));
      } catch (error) {
        logger.error('Failed to fetch tags:', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 });
      }
    } else if (slug) {
      // GET a single blog post by slug
      return handleApiRoute(req, async () => {
        const blogPost = await getPostBySlug(slug);
        return NextResponse.json({ post: blogPost });
      }, { validations });
    } else {
      return NextResponse.json({ error: 'Missing action or slug parameter' }, { status: 400 });
    }
  } else if (req.method === 'PUT' || req.method === 'DELETE') {
    // PUT or DELETE require a slug parameter
    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }
    return handleApiRoute(req, async () => {
      if (req.method === 'PUT') {
        const updates = await req.json();
        const updatedPost = await updatePost(slug, updates);
        return NextResponse.json({ post: updatedPost });
      } else if (req.method === 'DELETE') {
        await deletePost(slug);
        return NextResponse.json({ success: true });
      }
      throw new ApiError('Method not allowed', 405);
    }, { validations });
  } else if (req.method === 'POST') {
    if (action === 'preview') {
      // POST for previewing blog content
      try {
        const session = await getServerSession();
        if (!session?.user) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        const { content } = await req.json();
        if (!content) {
          return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }
        const html = await previewContent(content);
        return NextResponse.json({ html });
      } catch (error) {
        logger.error('Failed to generate preview', {
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        if (error instanceof BlogError) {
          return NextResponse.json({ error: error.message }, { status: error.statusCode });
        }
        return NextResponse.json({ error: 'Failed to generate preview' }, { status: 500 });
      }
    }
    return NextResponse.json({ error: 'Invalid POST action' }, { status: 400 });
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}

export default handler;
