export const contactFormTemplate = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => ({
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
      <p style="color: #6b7280; font-size: 0.875rem; margin-top: 20px;">
        This email was sent from the Oslo Languages contact form.
      </p>
    </div>
  `,
  text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}

This email was sent from the Oslo Languages contact form.
  `,
});