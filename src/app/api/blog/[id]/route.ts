// src/app/api/blog/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getPostBySlug, deletePost } from '@/lib/data/blog'; // Adjust the import path as necessary

// Utility functions for consistent responses
function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const post = getPostBySlug(params.id);
    
    if (!post) {
      return errorResponse('Blog post not found', 404);
    }
    
    return successResponse(post);
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return errorResponse('Failed to fetch blog post', 500);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return errorResponse('Invalid ID format');
    }
    
    deletePost(id);
    
    return successResponse({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog post:', error);
    return errorResponse('Failed to delete blog post', 500);
  }
}