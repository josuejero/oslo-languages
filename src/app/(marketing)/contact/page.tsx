// src/app/(marketing)/contact/page.tsx
import { Suspense } from 'react';
import ContactForm from '@/components/contact/ContactForm';

export default function Contact() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-text-primary animate-fadeIn">Contact Us</h1>
        
        <Suspense fallback={
          <div className="bg-background-secondary p-8 rounded-lg animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-24 bg-gray-200 rounded w-full mb-4"></div>
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
          </div>
        }>
          <div className="animate-fadeIn">
            <ContactForm />
          </div>
        </Suspense>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-background-primary p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 animate-fadeIn delay-200">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Visit Us</h2>
            <p className="mb-2 text-text-secondary">Karl Johans gate 25</p>
            <p className="mb-2 text-text-secondary">0159 Oslo, Norway</p>
            <p className="text-text-secondary">Monday - Friday: 9:00 - 18:00</p>
          </div>
          
          <div className="bg-background-primary p-6 rounded-lg shadow hover:shadow-lg transition-all duration-300 animate-fadeIn delay-300">
            <h2 className="text-xl font-semibold mb-4 text-text-primary">Contact Information</h2>
            <p className="mb-2 text-text-secondary">Email: <a href="mailto:info@oslolanguages.no" className="text-action-primary hover:text-action-primaryHover transition-colors">info@oslolanguages.no</a></p>
            <p className="mb-2 text-text-secondary">Phone: <a href="tel:+4722334455" className="text-action-primary hover:text-action-primaryHover transition-colors">+47 22 33 44 55</a></p>
          </div>
        </div>
      </div>
    </section>
  );
}