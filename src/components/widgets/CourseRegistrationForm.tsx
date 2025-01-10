// src/components/widgets/CourseRegistrationForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormData = {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Course Details
  courseId: string;
  preferredSchedule: string;
  startDate: string;
  // Additional Information
  currentLevel: string;
  goals: string;
  specialRequirements: string;
  // Marketing
  heardFrom: string;
  marketingConsent: boolean;
};

const SCHEDULE_OPTIONS = [
  'Morning (09:00-11:00)',
  'Afternoon (14:00-16:00)',
  'Evening (18:00-20:00)',
  'Weekend (10:00-14:00)',
] as const;

const LEVEL_OPTIONS = [
  'Complete Beginner',
  'Basic Knowledge (A1)',
  'Elementary (A2)',
  'Intermediate (B1)',
  'Upper Intermediate (B2)',
  'Advanced (C1/C2)',
] as const;

const HEARD_FROM_OPTIONS = [
  'Google Search',
  'Social Media',
  'Friend/Family',
  'Advertisement',
  'Other',
] as const;

const CourseRegistrationForm = ({ courseId = '', courseName = '' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit registration');
      }

      setSubmitSuccess(true);
      reset();
    } catch (error) {
      setSubmitError('Failed to submit registration. Please try again later.');
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {submitSuccess && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md">
          Thank you for your registration! We&apos;ll contact you shortly to confirm your enrollment.
        </div>
      )}

      {submitError && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md">
          {submitError}
        </div>
      )}

      {/* Course Selection */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold mb-2">Selected Course</h3>
        <p>{courseName || 'Please select a course'}</p>
        <input 
          type="hidden" 
          {...register('courseId')} 
          value={courseId} 
        />
      </div>

      {/* Personal Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="firstName">
            First Name
          </label>
          <input
            {...register('firstName', { required: 'First name is required' })}
            type="text"
            id="firstName"
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="lastName">
            Last Name
          </label>
          <input
            {...register('lastName', { required: 'Last name is required' })}
            type="text"
            id="lastName"
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="email">
            Email
          </label>
          <input
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address',
              },
            })}
            type="email"
            id="email"
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="phone">
            Phone Number
          </label>
          <input
            {...register('phone', {
              required: 'Phone number is required',
              pattern: {
                value: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
                message: 'Invalid phone number',
              },
            })}
            type="tel"
            id="phone"
            className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
          )}
        </div>
      </div>

      {/* Schedule Preferences */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="preferredSchedule">
          Preferred Schedule
        </label>
        <select
          {...register('preferredSchedule', { required: 'Please select a preferred schedule' })}
          id="preferredSchedule"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select a schedule</option>
          {SCHEDULE_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.preferredSchedule && (
          <p className="mt-1 text-sm text-red-600">{errors.preferredSchedule.message}</p>
        )}
      </div>

      {/* Current Level */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="currentLevel">
          Current Language Level
        </label>
        <select
          {...register('currentLevel', { required: 'Please select your current level' })}
          id="currentLevel"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select your level</option>
          {LEVEL_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {errors.currentLevel && (
          <p className="mt-1 text-sm text-red-600">{errors.currentLevel.message}</p>
        )}
      </div>

      {/* Learning Goals */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="goals">
          Learning Goals
        </label>
        <textarea
          {...register('goals')}
          id="goals"
          rows={3}
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="What do you hope to achieve with this course?"
        />
      </div>

      {/* Special Requirements */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="specialRequirements">
          Special Requirements
        </label>
        <textarea
          {...register('specialRequirements')}
          id="specialRequirements"
          rows={3}
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
          placeholder="Any special requirements or accommodations needed?"
        />
      </div>

      {/* Marketing Information */}
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="heardFrom">
          How did you hear about us?
        </label>
        <select
          {...register('heardFrom')}
          id="heardFrom"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select an option</option>
          {HEARD_FROM_OPTIONS.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      {/* Marketing Consent */}
      <div className="flex items-start">
        <input
          {...register('marketingConsent')}
          type="checkbox"
          id="marketingConsent"
          className="mt-1"
        />
        <label htmlFor="marketingConsent" className="ml-2 text-sm">
          I agree to receive marketing communications about special offers and updates. You can unsubscribe at any time.
        </label>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-300"
      >
        {isSubmitting ? 'Submitting...' : 'Register for Course'}
      </button>
    </form>
  );
};

export default CourseRegistrationForm;