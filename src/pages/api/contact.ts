import type { NextApiRequest, NextApiResponse } from 'next';
import { sendContactEmail, EmailError } from '../../utils/email';
import { logger } from '../../utils/logger';

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  return emailRegex.test(email);
}

// Validate form data
function validateFormData(data: ContactFormData): string | null {
  if (!data.name || data.name.trim().length < 2) {
    return 'Name must be at least 2 characters long';
  }
  if (!data.email || !isValidEmail(data.email)) {
    return 'Valid email address is required';
  }
  if (!data.subject || data.subject.trim().length < 3) {
    return 'Subject is required';
  }
  if (!data.message || data.message.trim().length < 10) {
    return 'Message must be at least 10 characters long';
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const formData: ContactFormData = req.body;

    // Validate form data
    const validationError = validateFormData(formData);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    // Send email using SendGrid
    await sendContactEmail(formData);

    // Log successful submission
    logger.info('Contact form submitted successfully', {
      name: formData.name,
      email: formData.email
    });

    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will contact you soon.'
    });
  } catch (error: unknown) {
    // Handle known email errors
    if (error instanceof EmailError) {
      return res.status(error.statusCode).json({ success: false, error: error.message });
    }
    logger.error('Contact form error', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return res.status(500).json({
      success: false,
      error: 'Failed to send message. Please try again later.'
    });
  }
}
