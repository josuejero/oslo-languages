// src/app/api/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { apiRateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  // Check rate limit
  const clientIp = request.headers.get('x-forwarded-for') || 'unknown';
  const rateLimitResponse = await apiRateLimit(clientIp);
  if (rateLimitResponse) return rateLimitResponse;
  try {
    const data = await request.json();

    // Input validation
    const errors = [];
    if (!data.firstName?.trim()) errors.push('First name is required');
    if (!data.lastName?.trim()) errors.push('Last name is required');
    if (!data.email?.trim()) errors.push('Email is required');
    if (!data.phone?.trim()) errors.push('Phone is required');
    if (!data.courseId?.trim()) errors.push('Course selection is required');
    if (!data.preferredSchedule?.trim()) errors.push('Preferred schedule is required');
    if (!data.currentLevel?.trim()) errors.push('Current level is required');

    // Email validation
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (data.email && !emailRegex.test(data.email)) {
      errors.push('Invalid email address');
    }

    // Phone validation
    const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    if (data.phone && !phoneRegex.test(data.phone)) {
      errors.push('Invalid phone number');
    }

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    // Sanitize input
    const sanitizedData = {
      firstName: data.firstName.trim().slice(0, 100),
      lastName: data.lastName.trim().slice(0, 100),
      email: data.email.trim().slice(0, 100),
      phone: data.phone.trim().slice(0, 20),
      courseId: data.courseId.trim(),
      preferredSchedule: data.preferredSchedule.trim(),
      currentLevel: data.currentLevel.trim(),
      goals: (data.goals || '').trim().slice(0, 1000),
      specialRequirements: (data.specialRequirements || '').trim().slice(0, 1000),
      heardFrom: (data.heardFrom || '').trim(),
      marketingConsent: !!data.marketingConsent,
    };

    // Here you would typically:
    // 1. Save to database
    // 2. Send confirmation email
    // 3. Send notification to staff
    // 4. Log the registration

    return NextResponse.json(
      {
        success: true,
        message: 'Registration submitted successfully.',
        data: sanitizedData,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );

  } catch (error) {
    console.error('Registration error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process registration. Please try again later.',
      },
      { status: 500 }
    );
  }
}