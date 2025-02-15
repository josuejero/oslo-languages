// src/pages/api/blog/tags.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAllPosts } from '@/utils/blog';
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
    
    // Aggregate tags with post counts
    const tags = posts.reduce((acc, post) => {
      post.tags.forEach(tag => {
        const slug = tag.toLowerCase().replace(/\s+/g, '-');
        acc[slug] = acc[slug] || { name: tag, count: 0, slug };
        acc[slug].count++;
      });
      return acc;
    }, {} as Record<string, { name: string; count: number; slug: string; }>);

    res.status(200).json(Object.values(tags));
  } catch (error) {
    logger.error('Failed to fetch tags:', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
}