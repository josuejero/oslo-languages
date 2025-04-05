// src/components/contact/useContactForm.tsx
'use client';

import { useState, FormEvent, ChangeEvent } from 'react';
import { FormData, SubmissionStatus } from './types';
import { validateForm } from './validation';

export function useContactForm() {
  // State for form fields
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // State for validation errors
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Submission & status tracking
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>(null);

  // Handle input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Validate and submit form
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      // POST form data to /api/contact
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit the form');
      }

      // Success message
      setStatus({
        type: 'success',
        message: 'Thank you for your message. We will contact you soon.'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
      setErrors({});
    } catch (error: unknown) {
      setStatus({
        type: 'error',
        message: 'Failed to submit the form. Please try again later.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    isSubmitting,
    status,
    handleChange,
    handleSubmit
  };
}
