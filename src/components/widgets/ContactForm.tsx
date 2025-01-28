// src/components/widgets/ContactForm.tsx
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { logger } from '@/lib/logger';
import { FormField, Input, Textarea } from '@/components/ui/form';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

const STORAGE_KEY = 'contact_form_draft';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>();

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    
    try {
      logger.info('Submitting contact form', { email: data.email });

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the form');
      }

      setSubmitSuccess(true);
      localStorage.removeItem(STORAGE_KEY);
      reset();
    } catch (error) {
      logger.error('Contact form submission failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setSubmitError('Failed to submit the form. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    reset();
  };

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-6"
      noValidate
      aria-label="Contact form"
    >
      {submitSuccess && (
        <div 
          role="alert"
          aria-live="polite"
          className="p-4 bg-green-100 text-green-700 rounded-md"
        >
          Thank you for your message! We&apos;ll get back to you soon.
        </div>
      )}
      
      {submitError && (
        <div 
          role="alert"
          className="p-4 bg-red-100 text-red-700 rounded-md"
        >
          {submitError}
        </div>
      )}

      <FormField
        label="Name"
        required
        error={errors.name?.message}
      >
        <Input
          {...register('name', { required: 'Name is required' })}
          type="text"
        />
      </FormField>

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
        />
      </FormField>

      <FormField
        label="Subject"
        required
        error={errors.subject?.message}
      >
        <Input
          {...register('subject', { required: 'Subject is required' })}
          type="text"
        />
      </FormField>

      <FormField
        label="Message"
        required
        error={errors.message?.message}
      >
        <Textarea
          {...register('message', { required: 'Message is required' })}
          rows={5}
        />
      </FormField>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={clearSavedData}
          className="text-gray-600 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 px-4 py-2 rounded"
        >
          Clear Form
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
}

export default ContactForm;