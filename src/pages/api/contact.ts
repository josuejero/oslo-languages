// src/pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { sendContactEmail } from '@/utils/email';
import { logger } from '@/utils/logger';

type ResponseData = {
  success: boolean;
  message?: string;
  error?: string | string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request for CORS
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed'
    });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !subject || !message) {
      logger.info('Validation failed - missing fields', { 
        name: !!name, 
        email: !!email, 
        subject: !!subject, 
        message: !!message 
      });
      
      return res.status(400).json({
        success: false,
        error: 'All fields are required'
      });
    }

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(email)) {
      logger.info('Invalid email', { email });
      
      return res.status(400).json({
        success: false,
        error: 'Invalid email address'
      });
    }

    // Send email
    await sendContactEmail({
      name,
      email,
      subject,
      message
    });

    // Log success
    logger.info('Contact form submitted successfully', {
      email,
      subject
    });

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will contact you soon.'
    });

  } catch (error) {
    // Log error with full details
    logger.error('Contact form error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
}