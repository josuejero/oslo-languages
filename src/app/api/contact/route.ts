// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';

// Set your SendGrid API key
const apiKey = process.env.SENDGRID_API_KEY || '';
if (apiKey && apiKey.startsWith('SG.')) {
  sgMail.setApiKey(apiKey);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;
    
    // Validate inputs
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if SendGrid is properly configured
    if (!apiKey || !apiKey.startsWith('SG.')) {
      console.warn('SendGrid API key not configured or invalid');
      // For development, you can return a mock success response
      return NextResponse.json(
        { message: 'Contact form submitted successfully (SendGrid disabled)' },
        { status: 200 }
      );
    }
    
    // Prepare email
    const msg = {
      to: process.env.ADMIN_EMAIL || 'admin@example.com',
      from: process.env.FROM_EMAIL || 'noreply@oslolanguages.com',
      subject: `Contact Form: ${subject}`,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `,
    };
    
    // Send email
    await sgMail.send(msg);
    
    return NextResponse.json(
      { message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to process contact form' },
      { status: 500 }
    );
  }
}