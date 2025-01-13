// src/components/widgets/ContactForm.tsx
import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { logger } from '@/lib/logger';
import { FormField, Input, Textarea } from '@/components/ui/form';




type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
  attachments: FileList;
};

const STORAGE_KEY = 'contact_form_draft';
const AUTOSAVE_DELAY = 1000;



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

  const formValues = watch();

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

  useEffect(() => {
    if (!isDirty) return;

    const timer = setTimeout(() => {
      const dataToSave = { ...formValues };
      delete (dataToSave as Partial<FormData>).attachments;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      logger.info('Form autosaved');
    }, AUTOSAVE_DELAY);
    
    return () => clearTimeout(timer);
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

      <FormField
        label="Attachments"
        hint="Max file size: 5MB. Allowed types: PDF, DOC, DOCX, TXT, JPG, PNG"
      >
        <Input
          {...register('attachments')}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        />
      </FormField>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div 
          role="progressbar" 
          aria-valuenow={uploadProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="w-full bg-gray-200 rounded-full h-2.5"
        >
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}

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