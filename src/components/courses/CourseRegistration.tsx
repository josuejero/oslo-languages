import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FormField, Input, Select } from '@/components/ui/form';
import LoadingSpinner from '@/components/LoadingSpinner';

interface CourseRegistrationProps {
  courseId: string;
  sessionId: string;
  courseName: string;
  sessionDate: string;
  isWaitlist?: boolean;
}

interface RegistrationData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  languageLevel?: string;
  specialRequirements?: string;
}

const LANGUAGE_LEVELS = [
  { value: 'beginner', label: 'Beginner (A1)' },
  { value: 'elementary', label: 'Elementary (A2)' },
  { value: 'intermediate', label: 'Intermediate (B1)' },
  { value: 'upperIntermediate', label: 'Upper Intermediate (B2)' },
  { value: 'advanced', label: 'Advanced (C1)' }
];

export default function CourseRegistration({
  courseId,
  sessionId,
  courseName,
  sessionDate,
  isWaitlist = false
}: CourseRegistrationProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<RegistrationData>();

  const onSubmit = async (data: RegistrationData) => {
    setSubmitStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/courses/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, sessionId, ...data }),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Failed to process registration');
      }

      setSubmitStatus('success');
      reset(); // Clear form
    } catch (error: unknown) {
      setSubmitStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to process registration');
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="text-center p-6 bg-green-50 rounded-lg">
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {isWaitlist ? 'Added to Waitlist' : 'Registration Successful'}
        </h3>
        <p className="text-green-600">
          {isWaitlist
            ? "We'll contact you when a spot becomes available."
            : "Thank you for registering! You'll receive a confirmation email shortly."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitStatus === 'error' && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium">{courseName}</h3>
        <p className="text-sm text-gray-600">Starting {sessionDate}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <FormField label="First Name" error={errors.firstName?.message} required>
          <Controller
            name="firstName"
            control={control}
            rules={{ required: 'First name is required' }}
            render={({ field }) => (
              <Input {...field} disabled={submitStatus === 'loading'} aria-invalid={errors.firstName ? 'true' : 'false'} />
            )}
          />
        </FormField>

        <FormField label="Last Name" error={errors.lastName?.message} required>
          <Controller
            name="lastName"
            control={control}
            rules={{ required: 'Last name is required' }}
            render={({ field }) => (
              <Input {...field} disabled={submitStatus === 'loading'} aria-invalid={errors.lastName ? 'true' : 'false'} />
            )}
          />
        </FormField>

        <FormField label="Email" error={errors.email?.message} required>
          <Controller
            name="email"
            control={control}
            rules={{
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            }}
            render={({ field }) => (
              <Input {...field} type="email" disabled={submitStatus === 'loading'} aria-invalid={errors.email ? 'true' : 'false'} />
            )}
          />
        </FormField>

        <FormField label="Phone" error={errors.phone?.message} required>
          <Controller
            name="phone"
            control={control}
            rules={{ required: 'Phone number is required' }}
            render={({ field }) => (
              <Input {...field} type="tel" disabled={submitStatus === 'loading'} aria-invalid={errors.phone ? 'true' : 'false'} />
            )}
          />
        </FormField>
      </div>

      <FormField label="Current Language Level" error={errors.languageLevel?.message}>
        <Controller
          name="languageLevel"
          control={control}
          render={({ field }) => (
            <Select options={LANGUAGE_LEVELS} {...field} disabled={submitStatus === 'loading'} />
          )}
        />
      </FormField>

      <FormField label="Special Requirements or Comments" error={errors.specialRequirements?.message}>
        <Controller
          name="specialRequirements"
          control={control}
          render={({ field }) => (
            // Render a native textarea instead of using Input with an unsupported "as" prop
            <textarea
              {...field}
              rows={3}
              disabled={submitStatus === 'loading'}
              className="input" // Apply appropriate styling
            />
          )}
        />
      </FormField>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => reset()}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={submitStatus === 'loading'}
        >
          Clear Form
        </button>
        <button
          type="submit"
          disabled={submitStatus === 'loading'}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {submitStatus === 'loading' ? (
            <>
              <LoadingSpinner />
              <span>Processing...</span>
            </>
          ) : (
            <span>{isWaitlist ? 'Join Waitlist' : 'Complete Registration'}</span>
          )}
        </button>
      </div>
    </form>
  );
}
