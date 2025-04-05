// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import sgMail from '@sendgrid/mail';
import { ContactFormData } from '@/types';

// Utility functions for consistent responses
function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}

// Set your SendGrid API key
const apiKey = process.env.SENDGRID_API_KEY || '';
if (apiKey && apiKey.startsWith('SG.')) {
  sgMail.setApiKey(apiKey);
}

export async function POST(request: Request) {
  try {
    const body: ContactFormData = await request.json();
    const { name, email, subject, message } = body;
    
    // Validate inputs
    if (!name || !email || !subject || !message) {
      return errorResponse('Missing required fields');
    }
    
    // Check if SendGrid is properly configured
    if (!apiKey || !apiKey.startsWith('SG.')) {
      console.warn('SendGrid API key not configured or invalid');
      
      // For development, return mock success
      if (process.env.NODE_ENV === 'development') {
        return successResponse({ 
          message: 'Contact form submitted successfully (SendGrid disabled in development)' 
        });
      } else {
        return errorResponse('Email service configuration error', 500);
      }
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
    
    return successResponse({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return errorResponse('Failed to process contact form', 500);
  }
}