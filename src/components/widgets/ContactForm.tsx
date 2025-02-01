// src/components/widgets/ContactForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { logger } from '@/lib/logger';
import { FormField, Input, Textarea } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

type SubmissionStatus = {
  type: 'success' | 'error';
  message: string;
} | null;

const INITIAL_MESSAGE_TIMEOUT = 5000; // 5 seconds

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>(null);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormData>();

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setStatus(null);
    
    try {
      logger.info('Submitting contact form', { email: data.email });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit the form');
      }

      setStatus({
        type: 'success',
        message: result.message || 'Thank you for your message. We will contact you soon.'
      });

      // Reset form after successful submission
      reset();

      // Clear success message after timeout
      setTimeout(() => {
        setStatus(null);
      }, INITIAL_MESSAGE_TIMEOUT);

    } catch (error) {
      logger.error('Contact form submission failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      
      setStatus({
        type: 'error',
        message: 'Failed to submit the form. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6"
      noValidate
      aria-label="Contact form"
    >
      {/* Status Messages */}
      {status && (
        <Alert 
          variant={status.type === 'success' ? 'success' : 'destructive'}
          role="alert"
          aria-live="polite"
        >
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      {/* Name Field */}
      <FormField
        label="Name"
        required
        error={errors.name?.message}
      >
        <Input
          {...register('name', { 
            required: 'Name is required',
            minLength: {
              value: 2,
              message: 'Name must be at least 2 characters'
            }
          })}
          type="text"
          aria-invalid={errors.name ? 'true' : 'false'}
          disabled={isSubmitting}
        />
      </FormField>

      {/* Email Field */}
      <FormField
        label="Email"
        required
        error={errors.email?.message}
        hint="We'll never share your email with anyone else."
      >
        <Input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          disabled={isSubmitting}
        />
      </FormField>

      {/* Subject Field */}
      <FormField
        label="Subject"
        required
        error={errors.subject?.message}
      >
        <Input
          {...register('subject', { 
            required: 'Subject is required',
            minLength: {
              value: 5,
              message: 'Subject must be at least 5 characters'
            }
          })}
          type="text"
          aria-invalid={errors.subject ? 'true' : 'false'}
          disabled={isSubmitting}
        />
      </FormField>

      {/* Message Field */}
      <FormField
        label="Message"
        required
        error={errors.message?.message}
      >
        <Textarea
          {...register('message', { 
            required: 'Message is required',
            minLength: {
              value: 10,
              message: 'Message must be at least 10 characters'
            },
            maxLength: {
              value: 1000,
              message: 'Message must not exceed 1000 characters'
            }
          })}
          rows={5}
          aria-invalid={errors.message ? 'true' : 'false'}
          disabled={isSubmitting}
          className="resize-y"
        />
      </FormField>

      {/* Form Controls */}
      <div className="flex justify-between items-center">
        <button
          type="button"
          onClick={() => reset()}
          className="text-gray-600 hover:text-gray-900 disabled:text-gray-400 px-4 py-2 rounded transition-colors"
          disabled={isSubmitting}
        >
          Clear Form
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="sr-only">Sending message...</span>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline-block"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Sending...
            </>
          ) : (
            'Send Message'
          )}
        </button>
      </div>

      {/* Screen Reader Status Updates */}
      <div className="sr-only" aria-live="polite" role="status">
        {isSubmitting && 'Sending your message...'}
        {status?.type === 'success' && status.message}
      </div>
    </form>
  );
}