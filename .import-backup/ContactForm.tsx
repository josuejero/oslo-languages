// src/components/widgets/ContactForm.tsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { logger } from '@/utils/logger';
import { Alert, AlertDescription } from '@/components/ui/';
import { Send, RefreshCw } from 'lucide-react';

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
  const [formValues, setFormValues] = useState<Partial<FormData>>({});
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, dirtyFields, touchedFields }
  } = useForm<FormData>({
    defaultValues: formValues
  });

  // Animated validation feedback
  const getInputStyles = (fieldName: keyof FormData) => {
    const isDirty = dirtyFields[fieldName];
    const isTouched = touchedFields[fieldName];
    const hasError = errors[fieldName];
    
    if (hasError) return "border-red-500 focus:border-red-500 focus:ring-red-200";
    if (isDirty && isTouched) return "border-green-500 focus:border-green-500 focus:ring-green-200";
    return "border-gray-300 focus:border-blue-500 focus:ring-blue-200";
  };

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

      // Save form values temporarily in case user wants to send another message
      setFormValues(data);
      
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
      className="space-y-6 transition-all duration-300"
      noValidate
      aria-label="Contact form"
    >
      {/* Status Messages */}
      {status && (
        <Alert 
          variant={status.type === 'success' ? 'success' : 'destructive'}
          role="alert"
          aria-live="polite"
          className="animate-fadeIn"
        >
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            {...register('name', { 
              required: 'Name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters'
              }
            })}
            type="text"
            placeholder="Your name"
            className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${getInputStyles('name')}`}
            aria-invalid={errors.name ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1 animate-fadeIn">{errors.name.message}</p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            {...register('email', { 
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            type="email"
            placeholder="Your email address"
            className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${getInputStyles('email')}`}
            aria-invalid={errors.email ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1 animate-fadeIn">{errors.email.message}</p>
          )}
          <p className="text-xs text-gray-500 italic">We&apos;ll never share your email with anyone else.</p>
        </div>
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          {...register('subject', { 
            required: 'Subject is required',
            minLength: {
              value: 5,
              message: 'Subject must be at least 5 characters'
            }
          })}
          type="text"
          placeholder="What is your message about?"
          className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 ${getInputStyles('subject')}`}
          aria-invalid={errors.subject ? 'true' : 'false'}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p className="text-sm text-red-600 mt-1 animate-fadeIn">{errors.subject.message}</p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
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
          placeholder="Please write your message here..."
          className={`w-full px-4 py-3 rounded-lg focus:outline-none focus:ring-2 transition-all duration-300 resize-y ${getInputStyles('message')}`}
          aria-invalid={errors.message ? 'true' : 'false'}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p className="text-sm text-red-600 mt-1 animate-fadeIn">{errors.message.message}</p>
        )}
      </div>

      {/* Form Controls */}
      <div className="flex justify-between items-center pt-4">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center bg-white text-gray-700 hover:text-gray-900 disabled:text-gray-400 px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors shadow-sm group"
          disabled={isSubmitting}
        >
          <RefreshCw className="w-4 h-4 mr-2 group-hover:animate-spin" />
          Clear Form
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors shadow-md"
          aria-busy={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
            <>
              <Send className="w-5 h-5 mr-2" />
              Send Message
            </>
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