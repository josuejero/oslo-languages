// Testimonials.tsx
'use client';

import { useState, useEffect } from 'react';
import { testimonialsData } from './testimonialsData';
import TestimonialSkeleton from './TestimonialSkeleton';
import StarRating from './StarRating';
import OptimizedImage from '@/components/common/media/OptimizedImage';

/**
 * Client-side component for testimonials.
 */
export default function Testimonials() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Run only on client-side
  useEffect(() => {
    setMounted(true);

    // Auto-advance testimonials every 7 seconds (optional)
    const timer = setInterval(() => {
      setActiveIndex((current) =>
        current === testimonialsData.length - 1 ? 0 : current + 1
      );
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  // If not yet mounted, show skeleton loader
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto">
        <TestimonialSkeleton />
      </div>
    );
  }

  // Move to the next testimonial
  const nextTestimonial = () => {
    setActiveIndex((current) =>
      current === testimonialsData.length - 1 ? 0 : current + 1
    );
  };

  // Move to the previous testimonial
  const prevTestimonial = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonialsData.length - 1 : current - 1
    );
  };

  const currentTestimonial = testimonialsData[activeIndex];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 z-10 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Previous testimonial by ${currentTestimonial.name}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={nextTestimonial}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 z-10 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Next testimonial by ${
            testimonialsData[(activeIndex + 1) % testimonialsData.length].name
          }`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Testimonial Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-center text-center md:text-left gap-8">
            {/* Image and Rating */}
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-4">
                <div className="absolute inset-0 bg-blue-600 rounded-full opacity-10 transform -rotate-6"></div>
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <OptimizedImage
                    src={currentTestimonial.image}
                    alt={currentTestimonial.name}
                    fill
                    className="object-cover"
                    fallbackSrc="/images/placeholder-avatar.jpg"
                  />
                </div>
              </div>

              {/* Rating Stars */}
              <StarRating rating={currentTestimonial.rating} />
            </div>

            {/* Content */}
            <div className="flex-1">
              <blockquote className="text-lg md:text-xl mb-6 text-gray-800 italic relative">
                <svg
                  className="absolute -top-6 -left-6 w-12 h-12 text-blue-100 transform -rotate-12"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 32 32"
                >
                  <path d="M10 8c-3.9 0-7 3.1-7 7s3.1 7 7 7c0 0-1 3-5 3v2c0 0 8 0 8-11 0-3.9-3.1-7-7-7zm12 0c-3.9 0-7 3.1-7 7s3.1 7 7 7c0 0-1 3-5 3v2c0 0 8 0 8-11 0-3.9-3.1-7-7-7z"></path>
                </svg>
                <p>&quot;{currentTestimonial.text}&quot;</p>
              </blockquote>

              <div>
                <p className="font-bold text-lg text-gray-900">{currentTestimonial.name}</p>
                <p className="text-gray-600">{currentTestimonial.role}</p>
                <p className="text-blue-600 font-medium">{currentTestimonial.course}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-3 mt-8">
        {testimonialsData.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === activeIndex
                ? 'bg-blue-600 w-8'
                : 'bg-gray-300 hover:bg-gray-400'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
            aria-current={index === activeIndex ? 'true' : 'false'}
          >
            <span className="sr-only">Testimonial {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
