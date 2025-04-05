// src/app/(marketing)/courses/_MiddleCTASection.tsx
import React from 'react';
import Link from 'next/link';

const MiddleCTASection: React.FC = () => {
  return (
    <section className="py-16 bg-blue-50 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute -left-16 -top-16 w-64 h-64 bg-blue-100 rounded-full opacity-50 animate-float"></div>
      <div
        className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-100 rounded-full opacity-50 animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="relative container mx-auto px-4 text-center z-10">
        <div className="bg-background-primary p-8 md:p-12 rounded-2xl shadow-xl max-w-3xl mx-auto border border-border-default animate-fadeIn">
          <h2 className="text-2xl md:text-3xl font-bold mb-6 text-text-primary">
            Not sure which course is right for you?
          </h2>
          <p className="text-lg text-text-secondary mb-8">
            Get in touch with us for a personalized recommendation based on your goals and current level.
          </p>
          <Link
            href="/contact"
            className="inline-block bg-action-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-action-primaryHover transition-colors shadow-md transform hover:-translate-y-1 transition-all duration-300"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MiddleCTASection;
