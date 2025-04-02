// src/pages/api/admin/logout.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { serialize } from 'cookie';
import { logger } from '@/utils/logger';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  
  try {
    // Clear the auth cookie by setting expiration to past
    const cookie = serialize('admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0,
      path: '/'
    });
    
    res.setHeader('Set-Cookie', cookie);
    logger.info('Admin logout successful');
    
    return res.status(200).json({ success: true });
  } catch (error) {
    logger.error('Admin logout error', { 
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return res.status(500).json({ 
      success: false, 
      message: 'An error occurred during logout' 
    });
  }
}