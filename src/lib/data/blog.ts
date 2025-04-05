// src/lib/data/blog.ts
import { PrismaClient, BlogPost } from '@prisma/client';

const prisma = new PrismaClient();

export async function getAllPosts(): Promise<BlogPost[]> {
  return prisma.blogPost.findMany({
    orderBy: { date: 'desc' }
  });
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return prisma.blogPost.findUnique({
    where: { slug }
  });
}

export async function savePost(post: BlogPost): Promise<BlogPost> {
  if (post.id) {
    return prisma.blogPost.update({
      where: { id: post.id },
      data: post
    });
  } else {
    return prisma.blogPost.create({
      data: post
    });
  }
}

export async function deletePost(id: number): Promise<BlogPost> {
  return prisma.blogPost.delete({
    where: { id }
  });
}
