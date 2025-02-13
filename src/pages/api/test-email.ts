// src/pages/api/test-email.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendContactEmail } from '../../utils/email';
import { logger } from '../../utils/logger';

// NOTE: Remove this endpoint after testing!
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    await sendContactEmail({
      name: 'Test User',
      email: process.env.EMAIL_FROM || '',  // Use verified sender email
      subject: 'SendGrid Integration Test',
      message: 'This is a test message sent at ' + new Date().toISOString()
    });

    logger.info('Test email sent successfully');
    
    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully'
    });
  } catch (error) {
    logger.error('Test email failed', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to send test email'
    });
  }
}