// src/utils/__tests__/test-email.ts
import { sendContactEmail } from '../email';

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
    if (error.response) {
      console.error('SendGrid Response:', {
        status: error.response.status,
        body: error.response.body
      });
    }
  }
}

testSendGrid();