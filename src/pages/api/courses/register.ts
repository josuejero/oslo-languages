// src/pages/api/courses/register.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { sendContactEmail } from '@/utils/email';
import { logger } from '@/utils/logger';

interface RegistrationData {
  courseId: string;
  sessionId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  languageLevel?: string;
  specialRequirements?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data: RegistrationData = req.body;

    // Validate required fields
    if (!data.courseId || !data.firstName || !data.lastName || !data.email || !data.phone) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Dummy course details (replace with real data as needed)
    const course = {
      name: "Sample Course",
      startDate: "2024-01-01",
      schedule: "Mondays and Wednesdays",
      location: "Online",
      price: 1000,
    };

    // Send confirmation email using sendContactEmail
    await sendContactEmail({
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      subject: `Registration Confirmation for ${course.name}`,
      message: `Course Registration Details:
Course ID: ${data.courseId}
Session ID: ${data.sessionId}
Name: ${data.firstName} ${data.lastName}
Phone: ${data.phone}
Language Level: ${data.languageLevel || 'Not specified'}
Special Requirements: ${data.specialRequirements || 'None'}

Payment Details:
Payment of NOK ${course.price} is due within 7 days to confirm your registration.
Course Start Date: ${course.startDate}
Schedule: ${course.schedule}
Location: ${course.location}`
    });

    // Log successful registration
    logger.info('Course registration successful', {
      courseId: data.courseId,
      email: data.email,
    });

    return res.status(200).json({
      success: true,
      message: 'Registration successful',
    });
  } catch (error: unknown) {
    logger.error('Course registration failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    return res.status(500).json({
      error: 'Failed to process registration',
    });
  }
}
