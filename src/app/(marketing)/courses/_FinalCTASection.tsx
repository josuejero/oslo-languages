// src/app/(marketing)/courses/_FinalCTASection.tsx
import React from 'react';
import Link from 'next/link';

const FinalCTASection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
      <div className="container mx-auto px-4 text-center animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Ready to Start Your Language Journey?
        </h2>
        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Get in touch today and take the first step toward achieving your language learning goals.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
};

export default FinalCTASection;
