// src/app/contact/page.tsx
import { Suspense } from 'react';
import ContactForm from './contact-form';

export default function Contact() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>
        
        <Suspense fallback={<div>Loading form...</div>}>
          <ContactForm />
        </Suspense>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Visit Us</h2>
            <p className="mb-2">Karl Johans gate 25</p>
            <p className="mb-2">0159 Oslo, Norway</p>
            <p>Monday - Friday: 9:00 - 18:00</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <p className="mb-2">Email: info@oslolanguages.no</p>
            <p className="mb-2">Phone: +47 22 33 44 55</p>
          </div>
        </div>
      </div>
    </section>
  );
}