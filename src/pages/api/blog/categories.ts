// src/pages/api/blog/categories.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '@/utils/blog-operations';
import { logger } from '@/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const posts = await getAllPosts();
    
    // Aggregate categories with post counts
    const categories = posts.reduce((acc, post) => {
      post.categories.forEach(category => {
        const slug = category.toLowerCase().replace(/\s+/g, '-');
        acc[slug] = acc[slug] || { name: category, count: 0, slug };
        acc[slug].count++;
      });
      return acc;
    }, {} as Record<string, { name: string; count: number; slug: string; }>);

    res.status(200).json(Object.values(categories));
  } catch (error) {
    logger.error('Failed to fetch categories:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
}