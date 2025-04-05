'use client';

import { useState } from 'react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<null | 'success' | 'error'>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!email || !email.includes('@')) {
      setStatus('error');
      return;
    }
    
    // In a real implementation, you would send this to your API
    console.log('Subscribing email:', email);
    setStatus('success');
    setEmail('');
    
    // Reset status after 3 seconds
    setTimeout(() => setStatus(null), 3000);
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-md">
      <h3 className="text-xl font-bold mb-4 text-text-primary">
        Subscribe to Our Newsletter
      </h3>
      <p className="text-text-secondary mb-6">
        Get language learning tips and updates on new courses directly to your inbox.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
            className="flex-grow px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Subscribe
          </button>
        </div>
        
        {status === 'success' && (
          <p className="text-sm text-green-600">
            Thank you for subscribing!
          </p>
        )}
        
        {status === 'error' && (
          <p className="text-sm text-red-600">
            Please enter a valid email address.
          </p>
        )}
      </form>
    </div>
  );
}