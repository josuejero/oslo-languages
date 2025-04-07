// src/components/features/contact/types.ts

// Data structure for the contact form
export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Union type for submission status
export type SubmissionStatus = {
  type: 'success' | 'error';
  message: string;
} | null;