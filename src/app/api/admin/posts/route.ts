// src/app/api/admin/posts/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/config';
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { User } from 'next-auth';

interface SessionUser extends User {
  role: string;
}

const postsDirectory = path.join(process.cwd(), 'content/posts');

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    
    // Create slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    // Create frontmatter
    const frontmatter = {
      title: data.title,
      date: new Date().toISOString(),
      excerpt: data.excerpt,
      author: user.email,
      categories: data.categories,
      tags: data.tags,
      coverImage: data.coverImage,
    };

    // Create markdown content
    const fileContent = matter.stringify(data.content, frontmatter);

    // Write to file
    await fs.writeFile(
      path.join(postsDirectory, `${slug}.md`),
      fileContent,
      'utf8'
    );

    return NextResponse.json({ success: true, slug });
  } catch (err) {
    const error = err as Error;
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create post' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const session = await getServerSession(authOptions);
  const user = session?.user as SessionUser | undefined;
  
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();
    const slug = params.slug;

    // Create frontmatter
    const frontmatter = {
      title: data.title,
      excerpt: data.excerpt,
      author: user.email,
      categories: data.categories,
      tags: data.tags,
      coverImage: data.coverImage,
      date: new Date().toISOString(),
    };

    // Create markdown content
    const fileContent = matter.stringify(data.content, frontmatter);

    // Write to file
    await fs.writeFile(
      path.join(postsDirectory, `${slug}.md`),
      fileContent,
      'utf8'
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    const error = err as Error;
    console.error('Error updating post:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update post' },
      { status: 500 }
    );
  }
}