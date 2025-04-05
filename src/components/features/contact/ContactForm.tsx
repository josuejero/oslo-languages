'use client';

import { useContactForm } from './useContactForm';

export default function ContactForm() {
  const {
    formData,
    errors,
    isSubmitting,
    status,
    handleChange,
    handleSubmit
  } = useContactForm();

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white p-8 rounded-lg shadow-lg"
      noValidate
      aria-label="Contact form"
    >
      {/* Status Messages */}
      {status && (
        <div
          className={`p-4 rounded-lg ${
            status.type === 'success'
              ? 'bg-green-50 text-green-700 border border-green-200'
              : 'bg-red-50 text-red-700 border border-red-200'
          }`}
          role="alert"
        >
          {status.message}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Name Field */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.name ? 'true' : 'false'}
            disabled={isSubmitting}
          />
          {errors.name && (
            <p
              id="name-error"
              className="text-sm text-red-600 mt-1"
              aria-live="polite"
            >
              {errors.name}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your email address"
            className={`w-full px-4 py-3 rounded-lg border ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            aria-invalid={errors.email ? 'true' : 'false'}
            aria-describedby={errors.email ? 'email-error' : undefined}
            disabled={isSubmitting}
          />
          {errors.email && (
            <p
              id="email-error"
              className="text-sm text-red-600 mt-1"
              aria-live="polite"
            >
              {errors.email}
            </p>
          )}
        </div>
      </div>

      {/* Subject Field */}
      <div className="space-y-2">
        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
          Subject <span className="text-red-500">*</span>
        </label>
        <input
          id="subject"
          name="subject"
          type="text"
          value={formData.subject}
          onChange={handleChange}
          placeholder="What is your message about?"
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.subject ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
          aria-invalid={errors.subject ? 'true' : 'false'}
          disabled={isSubmitting}
        />
        {errors.subject && (
          <p
            id="subject-error"
            className="text-sm text-red-600 mt-1"
            aria-live="polite"
          >
            {errors.subject}
          </p>
        )}
      </div>

      {/* Message Field */}
      <div className="space-y-2">
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          placeholder="Please write your message here..."
          className={`w-full px-4 py-3 rounded-lg border ${
            errors.message ? 'border-red-500' : 'border-gray-300'
          } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-y`}
          aria-invalid={errors.message ? 'true' : 'false'}
          disabled={isSubmitting}
        />
        {errors.message && (
          <p
            id="message-error"
            className="text-sm text-red-600 mt-1"
            aria-live="polite"
          >
            {errors.message}
          </p>
        )}
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 
               focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
               disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
