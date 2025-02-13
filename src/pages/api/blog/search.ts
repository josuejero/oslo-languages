// src/pages/api/blog/search.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { searchPosts } from '@/utils/blog-operations';
import { logger } from '@/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      query = '',
      category,
      tag,
      page = '1',
      limit = '9',
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    const result = await searchPosts({
      query: String(query),
      category: category ? String(category) : undefined,
      tag: tag ? String(tag) : undefined,
      page: Number(page),
      limit: Number(limit),
      sortBy: String(sortBy) as 'date' | 'title',
      sortOrder: String(sortOrder) as 'asc' | 'desc'
    });

    res.status(200).json(result);
  } catch (error) {
    logger.error('Blog search error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      query: req.query
    });
    res.status(500).json({ error: 'Failed to search posts' });
  }
}