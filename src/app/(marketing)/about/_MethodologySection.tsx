

import React from 'react';

const MethodologySection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 transform translate-x-1/2 -translate-y-1/2 animate-float"></div>
      <div
        className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2 animate-float"
        style={{ animationDelay: '2s' }}
      ></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full mb-2">
            How We Teach
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Our Teaching <span className="text-indigo-600">Methodology</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary">
            Our approach combines proven language teaching methods with
            innovative practices.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {}
          <div className="bg-background-primary p-8 rounded-xl shadow-lg border-t-4 border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn delay-100">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
              {}
            </div>
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              Communicative Approach
            </h3>
            <p className="text-text-secondary">
              We emphasize practical communication skills through interactive
              activities and role-play.
            </p>
          </div>

          {}
          <div className="bg-background-primary p-8 rounded-xl shadow-lg border-t-4 border-indigo-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn delay-200">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
              {}
            </div>
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              Small Group Sizes
            </h3>
            <p className="text-text-secondary">
              Classes are limited to 12 students, ensuring individual attention
              and maximum speaking practice.
            </p>
          </div>

          {}
          <div className="bg-background-primary p-8 rounded-xl shadow-lg border-t-4 border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 animate-fadeIn delay-300">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
              {}
            </div>
            <h3 className="text-xl font-bold mb-4 text-text-primary">
              Cultural Integration
            </h3>
            <p className="text-text-secondary">
              Language is combined with cultural insights for a comprehensive
              understanding of the target language.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MethodologySection;