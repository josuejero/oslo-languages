// src/pages/api/blog/[slug].ts

import { NextRequest, NextResponse } from 'next/server';
import { handleApiRoute, validators } from '@/utils/api-utils';
import { getPostBySlug, updatePost, deletePost } from '@/utils/blog';
import { ApiError } from '../../../utils/api-utils';

const validations = {
  title: validators.required('title'),
  content: validators.minLength(10)
};

/**
 * API route handler for fetching, updating, or deleting a blog post by slug.
 * @param req - The NextRequest object.
 * @param context - The context containing route parameters.
 * @returns A NextResponse with the appropriate blog post data or status in JSON format.
 */
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  // Use handleApiRoute to wrap API logic with error handling and validations.
  return handleApiRoute(req, async () => {
    const { slug } = params; // Extract slug from the provided params.

    // Process the request based on the HTTP method.
    switch (req.method) {
      case 'GET': {
        // Retrieve the blog post by slug.
        const blogPost = await getPostBySlug(slug);
        // Wrap response in NextResponse.json to ensure a valid NextResponse.
        return NextResponse.json({ post: blogPost });
      }
      case 'PUT': {
        // Parse request body for updates.
        const updates = await req.json();
        const updatedPost = await updatePost(slug, updates);
        // Wrap updated post response in NextResponse.json for proper typing.
        return NextResponse.json({ post: updatedPost });
      }
      case 'DELETE': {
        // Delete the blog post.
        await deletePost(slug);
        // Wrap success response in NextResponse.json for consistency.
        return NextResponse.json({ success: true });
      }
      default:
        // Throw an error for unsupported HTTP methods.
        throw new ApiError('Method not allowed', 405);
    }
  }, { validations });
}
