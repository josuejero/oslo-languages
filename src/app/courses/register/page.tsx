// src/app/courses/register/page.tsx
import { Metadata } from 'next';
import CourseRegistrationForm from '@/components/widgets/CourseRegistrationForm';

export const metadata: Metadata = {
  title: 'Course Registration - Oslo Languages',
  description: 'Register for language courses at Oslo Languages. Choose from Norwegian, English, Spanish and more.',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Course Registration</h1>
        <p className="text-lg text-gray-600 mb-8">
          Please fill out the form below to register for your chosen course. 
          We&apos;ll contact you within 1-2 business days to confirm your registration 
          and provide payment details.
        </p>
        
        <CourseRegistrationForm />
      </div>
    </div>
  );
}