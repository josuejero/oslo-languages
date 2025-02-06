import { TransactionalEmailsApi } from '@getbrevo/brevo';

const apiInstance = new TransactionalEmailsApi();
apiInstance.setApiKey('api-key', process.env.BREVO_API_KEY || '');

interface EmailParams {
  name: string;
  email: string;
  message: string;
}

export async function sendContactEmail({ name, email, message }: EmailParams) {
  try {
    const sendSmtpEmail = {
      sender: { email: process.env.EMAIL_FROM || '' },
      to: [{ email: process.env.EMAIL_TO || '' }],
      subject: 'New Contact Form Submission',
      htmlContent: `<p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong><br/>${message}</p>`,
    };

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Email sent successfully:', response);
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw new Error('Failed to send contact email');
  }
}