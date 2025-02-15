// src/pages/api/blog/index.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import { createPost, BlogError } from '@/utils/blog';
import { logger } from '@/utils/logger';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const session = await getServerSession(req);
    
    if (req.method === 'POST') {
      if (!session?.user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const post = await createPost({
        ...req.body,
        author: session.user.email
      });

      return res.status(201).json({ post });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    logger.error('Blog API error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      method: req.method
    });

    if (error instanceof BlogError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}