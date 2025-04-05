// src/app/(marketing)/courses/_HeroSection.tsx
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-20">
      {/* Decorative background pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      {/* Decorative shapes */}
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-tr-full animate-float"></div>
      <div
        className="absolute top-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-bl-full animate-float"
        style={{ animationDelay: '1.5s' }}
      ></div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fadeIn">
          Language Courses in Oslo
        </h1>
        <p className="text-xl max-w-3xl mx-auto text-blue-100 animate-fadeIn delay-200">
          Whether you&apos;re starting your language journey or advancing your skills,
          our experienced teachers are here to guide you every step of the way.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
