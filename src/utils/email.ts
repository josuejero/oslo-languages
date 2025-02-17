import { contactFormTemplate } from './email-templates';
import sgMail, { MailDataRequired } from '@sendgrid/mail';
import { logger } from './logger';

// Define and export the EmailError class so it can be imported elsewhere.
export class EmailError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Export a generic sendEmail function using the correct type
export async function sendEmail(msg: MailDataRequired): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  try {
    await sgMail.send(msg);
    logger.info('Email sent successfully', { to: msg.to });
  } catch (error: unknown) {
    logger.error('Failed to send email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      msg
    });
    throw error;
  }
}

// Existing sendContactEmail function (if still needed)
export async function sendContactEmail(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<void> {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY is not set');
  }
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const { html, text } = contactFormTemplate(data);
  const msg: MailDataRequired = {
    to: process.env.EMAIL_TO!,
    from: {
      email: process.env.EMAIL_FROM!,
      name: 'Oslo Languages Contact Form'
    },
    replyTo: {
      email: data.email,
      name: data.name
    },
    subject: `New Contact Form Submission: ${data.subject}`,
    html,
    text,
  };

  try {
    await sgMail.send(msg);
    logger.info('Contact form email sent successfully', {
      to: process.env.EMAIL_TO,
      from: data.email
    });
  } catch (error: unknown) {
    logger.error('Failed to send contact form email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      data
    });
    throw error;
  }
}
