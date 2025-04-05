import { z } from 'zod';
import { FormData } from './types';

type ValidationErrors = Partial<Record<keyof FormData, string>>;

// Define a Zod schema for the contact form
const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  subject: z.string().min(1, 'Subject is required'),
  message: z.string().min(1, 'Message is required'),
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
