import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { ErrorMessage } from '@/components/ErrorBoundary';

interface ErrorSummaryProps {
  errors: Array<{
    field: string;
    message: string;
  }>;
  onFieldClick: (field: string) => void;
}


type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments: FileList;
};

const STORAGE_KEY = 'contact_form_draft';
const AUTOSAVE_DELAY = 1000; // 1 second

const ErrorSummary = ({ errors, onFieldClick }: ErrorSummaryProps) => (
  <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
    <h3 className="text-red-800 font-semibold mb-2">Please correct the following errors:</h3>
    <ul className="list-disc pl-5">
      {errors.map(({ field, message }) => (
        <li key={field}>
          <button
            type="button"
            onClick={() => onFieldClick(field)}
            className="text-red-700 hover:text-red-900 underline"
          >
            {message}
          </button>
        </li>
      ))}
    </ul>
  </div>
);

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
    watch,
    setValue,
  } = useForm<FormData>();

  // Watch form values for autosave
  const formValues = watch();

  // Load saved form data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      Object.keys(parsedData).forEach((key) => {
        if (key !== 'attachments') {
          setValue(key as keyof FormData, parsedData[key]);
        }
      });
    }
  }, [setValue]);

  // Autosave functionality
  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      const dataToSave = { ...formValues };
      delete (dataToSave as Partial<FormData>).attachments;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      logger.info('Form autosaved');
    }, AUTOSAVE_DELAY);    return () => clearTimeout(timer);
  }, [formValues, isDirty]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);
    
    try {
      logger.info('Submitting contact form', { email: data.email });

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('message', data.message);
      
      Array.from(data.attachments || []).forEach((file) => {
        formData.append('attachments', file);
      });

      const xhr = new XMLHttpRequest();
      xhr.open('POST', '/api/contact', true);

      xhr.upload.onprogress = (progressEvent) => {
        if (progressEvent.lengthComputable) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        }
      };

      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          setSubmitSuccess(true);
          localStorage.removeItem(STORAGE_KEY);
          reset();
        } else {
          throw new Error(`HTTP error! status: ${xhr.status}`);
        }
      };

      xhr.onerror = () => {
        throw new Error('Network error occurred');
      };

      xhr.send(formData);

    } catch (error) {
      logger.error('Contact form submission failed', {
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      setSubmitError('Failed to submit the form. Please try again later.');
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const clearSavedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    reset();
  };

  // Convert form errors to format expected by ErrorSummary
  const errorSummary = Object.entries(errors).map(([field, error]) => ({
    field,
    message: error.message || `Invalid ${field}`
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Summary */}
      {errorSummary.length > 0 && (
        <ErrorSummary 
          errors={errorSummary}
          onFieldClick={(field) => {
            document.getElementsByName(field)[0]?.focus();
          }}
        />
      )}

      {/* Success Message */}
      {submitSuccess && (
        <ErrorMessage variant="info" title="Success">
          Thank you for your message! We&apos;ll get back to you soon.
        </ErrorMessage>
      )}
      
      {/* Error Message */}
      {submitError && (
        <ErrorMessage title="Error">
          {submitError}
        </ErrorMessage>
      )}

      {/* Form Fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name
        </label>
        <input
          {...register('name', { required: 'Name is required' })}
          type="text"
          id="name"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.name && (
          <ErrorMessage>{errors.name.message}</ErrorMessage>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <input
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          type="email"
          id="email"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.email && (
          <ErrorMessage>{errors.email.message}</ErrorMessage>
        )}
      </div>

      <div>
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
          Subject
        </label>
        <input
          {...register('subject', { required: 'Subject is required' })}
          type="text"
          id="subject"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.subject && (
          <ErrorMessage>{errors.subject.message}</ErrorMessage>
        )}
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message
        </label>
        <textarea
          {...register('message', { required: 'Message is required' })}
          id="message"
          rows={5}
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        {errors.message && (
          <ErrorMessage>{errors.message.message}</ErrorMessage>
        )}
      </div>

      {/* File Upload */}
      <div>
        <label htmlFor="attachments" className="block text-sm font-medium text-gray-700 mb-1">
          Attachments
        </label>
        <input
          {...register('attachments')}
          type="file"
          id="attachments"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
          className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          Max file size: 5MB. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG
        </p>
      </div>

      {/* Upload Progress */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-between">
        <button
          type="button"
          onClick={clearSavedData}
          className="text-gray-600 hover:text-gray-900"
        >
          Clear Form
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:bg-blue-300"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;