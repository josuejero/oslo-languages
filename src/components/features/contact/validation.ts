// src/components/features/contact/validation.ts
import { z } from 'zod';
import { FormData } from './types';

type ValidationErrors = Partial<Record<keyof FormData, string>>;

// Define a Zod schema for the contact form
const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export function validateForm(formData: FormData): ValidationErrors {
  try {
    formSchema.parse(formData);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors.reduce((acc, curr) => {
        const field = curr.path[0] as keyof FormData;
        acc[field] = curr.message;
        return acc;
      }, {} as ValidationErrors);
    }
    return {};
  }
}