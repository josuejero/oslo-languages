// src/lib/email.ts
import { logger } from './logger';

// Type for email data
interface EmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Email template types
type EmailTemplate = 'contact' | 'confirmation';

// Template content interface
interface TemplateContent {
  subject: string;
  body: string;
}

// Email templates
const templates: Record<EmailTemplate, (data: EmailData) => TemplateContent> = {
  contact: (data) => ({
    subject: `New Contact Form Submission: ${data.subject}`,
    body: `
      <h2>New Contact Form Submission</h2>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
    `
  }),
  confirmation: (data) => ({
    subject: 'Thank you for contacting Oslo Languages',
    body: `
      <h2>Thank you for contacting Oslo Languages</h2>
      <p>Dear ${data.name},</p>
      <p>We have received your message and will get back to you as soon as possible.</p>
      <p>For reference, here's a copy of your message:</p>
      <hr>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Best regards,<br>Oslo Languages Team</p>
    `
  })
};

// Brevo API types
interface BrevoRecipient {
  email: string;
  name?: string;
}

interface BrevoEmail {
  sender: BrevoRecipient;
  to: BrevoRecipient[];
  subject: string;
  htmlContent: string;
}

export class EmailError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = 'EmailError';
  }
}

export async function sendEmail(template: EmailTemplate, data: EmailData): Promise<void> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new EmailError('Brevo API key not configured', 'CONFIG_ERROR');
    }

    const fromEmail = process.env.EMAIL_FROM;
    if (!fromEmail) {
      throw new EmailError('Sender email not configured', 'CONFIG_ERROR');
    }

    // Get template content
    const templateContent = templates[template](data);

    // Prepare email data for Brevo API
    const emailData: BrevoEmail = {
      sender: {
        email: fromEmail,
        name: 'Oslo Languages'
      },
      to: [{
        email: template === 'contact' ? process.env.EMAIL_TO! : data.email,
        name: template === 'contact' ? 'Oslo Languages Admin' : data.name
      }],
      subject: templateContent.subject,
      htmlContent: templateContent.body
    };

    // Send email using Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new EmailError(error.message || 'Failed to send email', 'API_ERROR');
    }

    logger.info('Email sent successfully', {
      template,
      to: emailData.to[0].email,
      subject: templateContent.subject
    });
  } catch (error) {
    logger.error('Failed to send email', {
      error: error instanceof Error ? error.message : 'Unknown error',
      template,
      to: template === 'contact' ? process.env.EMAIL_TO : data.email
    });
    throw error;
  }
}

// Function to validate email configuration
export async function validateEmailConfig(): Promise<boolean> {
  try {
    const apiKey = process.env.BREVO_API_KEY;
    const fromEmail = process.env.EMAIL_FROM;
    const toEmail = process.env.EMAIL_TO;

    if (!apiKey || !fromEmail || !toEmail) {
      logger.error('Email configuration missing', {
        hasApiKey: !!apiKey,
        hasFromEmail: !!fromEmail,
        hasToEmail: !!toEmail
      });
      return false;
    }

    // Test API key by making a simple API call
    const response = await fetch('https://api.brevo.com/v3/account', {
      headers: {
        'Accept': 'application/json',
        'api-key': apiKey
      }
    });

    if (!response.ok) {
      logger.error('Invalid Brevo API key', {
        status: response.status,
        statusText: response.statusText
      });
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Failed to validate email configuration', {
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    return false;
  }
}