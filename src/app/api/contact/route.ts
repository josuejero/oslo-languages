import { NextResponse } from 'next/server';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { ContactFormData } from '@/types';

// Create a schema for validation using Zod
const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

// Utility functions for standardized API responses
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
    // Parse the request body
    const body = await request.json();

    // Validate the input using Zod schema
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      // Combine all error messages into a single string
      const errorMessages = result.error.errors.map(err => err.message).join(', ');
      return errorResponse(errorMessages, 422);
    }
    
    // Destructure the validated data
    const { name, email, subject, message } = result.data;
    
    // Check if SendGrid is properly configured
    if (!apiKey || !apiKey.startsWith('SG.')) {
      console.warn('SendGrid API key not configured or invalid');
      
      // For development, return a mock success response
      if (process.env.NODE_ENV === 'development') {
        return successResponse({ 
          message: 'Contact form submitted successfully (SendGrid disabled in development)' 
        });
      } else {
        return errorResponse('Email service configuration error', 500);
      }
    }
    
    // Prepare the email message
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
    
    // Send the email via SendGrid
    await sgMail.send(msg);
    
    return successResponse({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return errorResponse('Failed to process contact form', 500);
  }
}
