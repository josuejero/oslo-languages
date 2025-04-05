// src/components/contact/validation.ts
import { FormData } from './types';

type ValidationErrors = Partial<Record<keyof FormData, string>>;

export function validateForm(formData: FormData): ValidationErrors {
  const newErrors: ValidationErrors = {};

  if (!formData.name.trim()) {
    newErrors.name = 'Name is required';
  }

  if (!formData.email.trim()) {
    newErrors.email = 'Email is required';
  } else if (
    !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
  ) {
    newErrors.email = 'Invalid email address';
  }

  if (!formData.subject.trim()) {
    newErrors.subject = 'Subject is required';
  }

  if (!formData.message.trim()) {
    newErrors.message = 'Message is required';
  }

  return newErrors;
}
