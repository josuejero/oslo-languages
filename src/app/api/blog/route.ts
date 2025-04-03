// src/app/api/blog/route.ts
import { NextResponse } from 'next/server';
import { getAllPosts, savePost } from '@/lib/blog';

export async function GET() {
  try {
    const posts = getAllPosts();
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const post = await request.json();
    
    // Validate the post data
    if (!post.title || !post.content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a slug if not provided
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
    
    return NextResponse.json(
      { message: 'Blog post saved successfully', post },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      { error: 'Failed to save blog post' },
      { status: 500 }
    );
  }
}