// src/components/courses/CourseRegistration.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface RegistrationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  languageLevel?: string;
  specialRequirements?: string;
}

interface CourseRegistrationProps {
  courseId: string;
  sessionId: string;
  courseName: string;
  sessionDate: string;
  isWaitlist?: boolean;
  onSubmit: (data: RegistrationFormData) => Promise<void>;
}

/**
 * CourseRegistration component renders a registration form for courses.
 * It uses react-hook-form for managing form state and validation.
 */
export default function CourseRegistration({
  courseId,
  sessionId,
  courseName,
  sessionDate,
  isWaitlist = false,
  onSubmit
}: CourseRegistrationProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Added defaultValues for optional fields to ensure they are set to empty strings if not provided.
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegistrationFormData>({
    defaultValues: { languageLevel: '', specialRequirements: '' },
    mode: 'onChange'
  });

  const handleRegistration = async (data: RegistrationFormData) => {
    console.debug('handleRegistration called with data:', data);
    setSubmitStatus('loading');
    try {
      await onSubmit(data);
      console.debug('Registration submitted successfully');
      setSubmitStatus('success');
    } catch (error) {
      console.error('Error in registration submission:', error);
      setSubmitStatus('error');
      if (error instanceof Error) {
              setErrorMessage(error.message);
            } else {
              setErrorMessage('An unexpected error occurred');
            }
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center p-6">
        <div className="mb-4">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">
          {isWaitlist ? 'Added to Waitlist' : 'Registration Successful'}
        </h3>
        <p className="text-gray-600">
          {isWaitlist
            ? "We'll contact you when a spot becomes available."
            : "We'll send you a confirmation email with further details."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(handleRegistration)} className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium">{courseName}</h3>
        <p className="text-sm text-gray-600">Starting {sessionDate}</p>
      </div>

      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            id="firstName"
            {...register('firstName', { required: 'First name is required' })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            id="lastName"
            {...register('lastName', { required: 'Last name is required' })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            id="email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            {...register('phone', { required: 'Phone number is required' })}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="languageLevel" className="block text-sm font-medium text-gray-700 mb-1">
          Current Language Level (Optional)
        </label>
        <select
          id="languageLevel"
          {...register('languageLevel')}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select level</option>
          <option value="none">No previous knowledge</option>
          <option value="beginner">Beginner (A1)</option>
          <option value="elementary">Elementary (A2)</option>
          <option value="intermediate">Intermediate (B1)</option>
          <option value="upperIntermediate">Upper Intermediate (B2)</option>
          <option value="advanced">Advanced (C1)</option>
        </select>
      </div>

      <div>
        <label htmlFor="specialRequirements" className="block text-sm font-medium text-gray-700 mb-1">
          Special Requirements or Comments (Optional)
        </label>
        <textarea
          id="specialRequirements"
          {...register('specialRequirements')}
          rows={3}
          className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        disabled={submitStatus === 'loading'}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
      >
        {submitStatus === 'loading'
          ? 'Processing...'
          : isWaitlist
          ? 'Join Waitlist'
          : 'Complete Registration'
        }
      </button>
    </form>
  );
}
