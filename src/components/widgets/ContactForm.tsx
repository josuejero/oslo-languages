'use client';

import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';

// Form data type
type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments: FileList;
};

// Error summary type
type ErrorSummary = {
  field: string;
  message: string;
}[];

const STORAGE_KEY = 'contact_form_draft';
const AUTOSAVE_DELAY = 1000; // 1 second

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errorSummary, setErrorSummary] = useState<ErrorSummary>([]);
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
        if (key !== 'attachments') { // Skip file inputs
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
      if ('attachments' in dataToSave) {
        delete (dataToSave as Partial<FormData>).attachments; // Don't save file inputs
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      logger.info('Form autosaved');
    }, AUTOSAVE_DELAY);
    return () => clearTimeout(timer);
  }, [formValues, isDirty]);

  // Update error summary when errors change
  useEffect(() => {
    const newErrorSummary: ErrorSummary = [];
    Object.entries(errors).forEach(([field, error]) => {
      if (error?.message) {
        newErrorSummary.push({
          field,
          message: error.message,
        });
      }
    });
    setErrorSummary(newErrorSummary);
  }, [errors]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setSubmitError(null);
    setUploadProgress(0);
    
    try {
      logger.info('Submitting contact form', { email: data.email });

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('subject', data.subject);
      formData.append('message', data.message);
      
      // Append each file
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
          logger.info('Contact form submitted successfully', { email: data.email });
          setSubmitSuccess(true);
          localStorage.removeItem(STORAGE_KEY); // Clear saved form data
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
        error: error instanceof Error ? error.message : 'Unknown error',
        data: { email: data.email },
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Error Summary */}
      {errorSummary.length > 0 && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          <h3 className="font-semibold mb-2">Please fix the following errors:</h3>
          <ul className="list-disc list-inside">
            {errorSummary.map((error, index) => (
              <li key={index}>
                <a
                  href={`#${error.field}`}
                  className="underline hover:text-red-900"
                >
                  {error.message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Success Message */}
      {submitSuccess && (
        <div className="p-4 bg-green-100 text-green-700 rounded-md mb-4">
          Thank you for your message! We&apos;ll get back to you soon.
        </div>
      )}
      
      {/* Error Message */}
      {submitError && (
        <div className="p-4 bg-red-100 text-red-700 rounded-md mb-4">
          {submitError}
        </div>
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
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
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
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
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
          <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
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
          <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
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
          ></div>
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