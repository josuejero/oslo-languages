import { NextResponse } from 'next/server';
import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { ContactFormData } from '@/types';


const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});


function errorResponse(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function successResponse(data: any, status = 200) {
  return NextResponse.json(data, { status });
}


const apiKey = process.env.SENDGRID_API_KEY || '';
if (apiKey && apiKey.startsWith('SG.')) {
  sgMail.setApiKey(apiKey);
}

export async function POST(request: Request) {
  try {
    
    const body = await request.json();

    
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      
      const errorMessages = result.error.errors.map(err => err.message).join(', ');
      return errorResponse(errorMessages, 422);
    }
    
    
    const { name, email, subject, message } = result.data;
    
    
    if (!apiKey || !apiKey.startsWith('SG.')) {
      console.warn('SendGrid API key not configured or invalid');
      
      
      if (process.env.NODE_ENV === 'development') {
        return successResponse({ 
          message: 'Contact form submitted successfully (SendGrid disabled in development)' 
        });
      } else {
        return errorResponse('Email service configuration error', 500);
      }
    }
    
    
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
    
    
    await sgMail.send(msg);
    
    return successResponse({ message: 'Contact form submitted successfully' });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return errorResponse('Failed to process contact form', 500);
  }
}
