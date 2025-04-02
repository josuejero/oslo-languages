// src/utils/email.ts
import sgMail from '@sendgrid/mail';
import { logger } from './logger';

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
} else {
  logger.warn('SENDGRID_API_KEY is not set');
}

export class EmailError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'EmailError';
  }
}

interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactEmail(data: EmailData): Promise<void> {
  console.log('email.ts: Attempting to send email', { to: data.email, subject: data.subject });

  // Skip actual email sending if testing environment
  if (process.env.SKIP_EMAIL_VERIFICATION === 'true') {
    console.log('email.ts: Skipping email send because SKIP_EMAIL_VERIFICATION is true');
    return;
  }

  if (!process.env.SENDGRID_API_KEY) {
    console.error('email.ts: SendGrid API key is not configured');
    throw new EmailError('SendGrid API key is not configured', 500);
  }

  if (!process.env.EMAIL_FROM || !process.env.EMAIL_TO) {
    console.error('email.ts: Email sender or recipient not configured');
    throw new EmailError('Email sender or recipient not configured', 500);
  }

  const msg = {
    to: process.env.EMAIL_TO,
    from: process.env.EMAIL_FROM,
    replyTo: data.email,
    subject: `Contact Form: ${data.subject}`,
    text: `
Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
    `,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Contact Form Submission</h2>
        <div style="background: #f3f4f6; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <div style="background: white; padding: 15px; border-radius: 3px; margin-top: 15px;">
            <p><strong>Message:</strong></p>
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    `
  };

  try {
    const [response] = await sgMail.send(msg);

    if (response.statusCode >= 400) {
      throw new EmailError('Failed to send email', response.statusCode);
    }

    logger.info('Email sent successfully', {
      to: process.env.EMAIL_TO,
      from: data.email,
      subject: data.subject
    });
  } catch (error) {
    const statusCode = error instanceof EmailError
      ? error.statusCode
      : (error && typeof error === 'object' && 'code' in error && typeof error.code === 'number'
          ? error.code
          : 500);

    logger.error('Failed to send email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      statusCode,
      data: { ...data, message: '[truncated]' }
    });

    throw new EmailError('Failed to send email', statusCode, error);
  }
}
