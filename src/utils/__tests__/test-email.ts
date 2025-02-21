// src/utils/__tests__/test-email.ts
import { sendContactEmail } from '../email';

interface SendGridError {
  response?: {
    status: number;
    body: any;
  };
  message: string;
}

async function testSendGrid() {
  try {
    await sendContactEmail({
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Test Email',
      message: 'This is a test email to verify SendGrid configuration.'
    });
    console.log('Test email sent successfully!');
  } catch (error) {
    console.error('Failed to send test email:', error);
    // Type guard to check if error is SendGridError
    if (error && typeof error === 'object' && 'response' in error) {
      const sendGridError = error as SendGridError;
      if (sendGridError.response) {
        console.error('SendGrid Response:', {
          status: sendGridError.response.status,
          body: sendGridError.response.body
        });
      }
    }
  }
}

testSendGrid();