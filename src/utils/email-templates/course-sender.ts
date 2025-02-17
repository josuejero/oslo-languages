// src/utils/email-templates/course-sender.ts

import { sendEmail } from '@/utils/email';
import { logger } from '@/utils/logger';
import {
  courseRegistrationTemplate,
  waitlistConfirmationTemplate,
  courseReminderTemplate,
  CourseRegistrationData,
  WaitlistData,
  CourseReminderData
} from './course-templates';

export type { CourseRegistrationData, WaitlistData, CourseReminderData };

export async function sendCourseRegistrationEmail(data: CourseRegistrationData) {
  try {
    const { html, text, subject } = courseRegistrationTemplate(data);
    await sendEmail({
      to: data.email,
      from: {
        email: process.env.EMAIL_FROM!,
        name: 'Oslo Languages Courses'
      },
      subject,
      html,
      text
    });
    logger.info('Course registration email sent', {
      course: data.courseName,
      email: data.email
    });
  } catch (error) {
    logger.error('Failed to send course registration email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      course: data.courseName,
      email: data.email
    });
    throw error;
  }
}

export async function sendWaitlistEmail(data: WaitlistData) {
  try {
    const { html, text, subject } = waitlistConfirmationTemplate(data);
    await sendEmail({
      to: data.email,
      from: {
        email: process.env.EMAIL_FROM!,
        name: 'Oslo Languages Courses'
      },
      subject,
      html,
      text
    });
    logger.info('Waitlist confirmation email sent', {
      course: data.courseName,
      email: data.email
    });
  } catch (error) {
    logger.error('Failed to send waitlist confirmation email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      course: data.courseName,
      email: data.email
    });
    throw error;
  }
}

export async function sendCourseReminderEmail(data: CourseReminderData) {
  try {
    const { html, text, subject } = courseReminderTemplate(data);
    await sendEmail({
      to: data.email,
      from: {
        email: process.env.EMAIL_FROM!,
        name: 'Oslo Languages Courses'
      },
      subject,
      html,
      text
    });
    logger.info('Course reminder email sent', {
      course: data.courseName,
      email: data.email
    });
  } catch (error) {
    logger.error('Failed to send course reminder email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      course: data.courseName,
      email: data.email
    });
    throw error;
  }
}
