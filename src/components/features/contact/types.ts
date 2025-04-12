


export interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}


export type SubmissionStatus = {
  type: 'success' | 'error';
  message: string;
} | null;