import sgMail from '@sendgrid/mail';
import { logger } from './logger';

// Initialize SendGrid client
const API_KEY = process.env.SENDGRID_API_KEY;
if (!API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is not set');
}
sgMail.setApiKey(API_KEY);

interface EmailParams {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class EmailError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
    this.name = 'EmailError';
  }
}

export async function sendContactEmail({ name, email, subject, message }: EmailParams): Promise<void> {
  // Validate required environment variables
  const fromEmail = process.env.EMAIL_FROM;
  const toEmail = process.env.EMAIL_TO;

  if (!fromEmail || !toEmail) {
    logger.error('Missing email configuration');
    throw new EmailError(
      'Email configuration error',
      'CONFIG_ERROR',
      500
    );
  }

  try {
    // Construct email content with proper HTML formatting
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f5f5f5; padding: 20px; border-radius: 5px;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject}</p>
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 3px;">
            ${message.replace(/\n/g, '<br>')}
          </div>
        </div>
      </div>
    `;

    const msg = {
      to: toEmail,
      from: {
        email: fromEmail,
        name: 'Oslo Languages Contact Form'
      },
      replyTo: {
        email,
        name
      },
      subject: `New Contact Form Submission: ${subject}`,
      html: htmlContent,
      text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`,
      mailSettings: {
        sandboxMode: {
          enable: process.env.NODE_ENV !== 'production'
        }
      }
    };

    await sgMail.send(msg);
    logger.info('Contact email sent successfully', { to: toEmail, from: email });
  } catch (error) {
    logger.error('Failed to send contact email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      name,
      email
    });

    // Determine error type and throw appropriate error
    if (error instanceof Error) {
      if (error.message.includes('quota')) {
        throw new EmailError('Email quota exceeded', 'QUOTA_ERROR', 429);
      }
      if (error.message.includes('invalid')) {
        throw new EmailError('Invalid email configuration', 'VALIDATION_ERROR', 400);
      }
    }

    throw new EmailError(
      'Failed to send email',
      'SEND_ERROR',
      500
    );
  }
}