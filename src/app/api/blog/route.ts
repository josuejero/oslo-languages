// src/app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { getAllPosts, savePost } from '@/lib/data/blog';
import { BlogPost } from '@/types';

// Utility functions for consistent responses
function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

export async function GET() {
  try {
    const posts = getAllPosts();
    return successResponse(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return errorResponse('Failed to fetch blog posts', 500);
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    
    // Validate required fields
    if (!post.title || !post.content) {
      return errorResponse('Missing required fields: title and content are required');
    }
    
    // Create slug if not provided
    if (!post.slug) {
      post.slug = post.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
    }
    
    // Set the date if not provided
    if (!post.date) {
      post.date = new Date().toISOString().split('T')[0];
    }
    
    savePost(post);
    
    return successResponse({ 
      message: 'Blog post saved successfully', 
      post 
    });
  } catch (error) {
    console.error('Error saving blog post:', error);
    return errorResponse('Failed to save blog post', 500);
  }
}