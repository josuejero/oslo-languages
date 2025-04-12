

import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section className="py-20 bg-background-primary">
      <div className="container mx-auto px-6 text-center animate-fadeIn">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary">
          Ready to start your language journey?
        </h2>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-8">
          Contact us today to learn more about our courses and find the perfect
          fit for your language goals.
        </p>
        <a
          href="/contact"
          className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300"
        >
          Contact Us
        </a>
      </div>
    </section>
  );
};

export default CTASection;