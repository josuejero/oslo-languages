// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';

// This would later use SendGrid for email sending
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
    
    // For now, just log the data (will be replaced with SendGrid)
    console.log('Contact form submission:', { name, email, subject, message });
    
    // In a real implementation, you would send email via SendGrid here
    
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