// src/components/widgets/Testimonials.tsx
'use client';

import { useState, useEffect } from 'react';
import OptimizedImage from '@/components/OptimizedImage';

/**
 * The Testimonial type represents a single student review
 */
type Testimonial = {
  id: number;
  name: string;
  role: string;
  image: string;
  course: string;
  text: string;
  rating: number;
};

// These would typically come from an API or CMS
const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Maria Johnson",
    role: "Software Developer",
    image: "/testimonials/maria.jpg",
    course: "Norwegian A1",
    text: "The Norwegian course at Oslo Languages exceeded my expectations. The teachers are incredibly supportive and the small class size ensures everyone gets attention.",
    rating: 5
  },
  {
    id: 2,
    name: "Thomas Berg",
    role: "Business Consultant",
    image: "/testimonials/thomas.jpg",
    course: "Business English",
    text: "Their Business English course helped me significantly improve my professional communication skills. The focus on real-world scenarios was particularly valuable.",
    rating: 5
  },
  {
    id: 3,
    name: "Sofia Garcia",
    role: "Student",
    image: "/testimonials/sofia.jpg",
    course: "Spanish B1",
    text: "Love the interactive teaching style! Made learning Spanish fun and practical. The cultural aspects included in the lessons were a great bonus.",
    rating: 5
  }
];

// Client-side component for testimonials
export default function Testimonials() {
  // Using a key to force remount for SSR
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Only run on client-side
  useEffect(() => {
    setMounted(true);
    
    // Optional: Auto-advance testimonials
    const timer = setInterval(() => {
      setActiveIndex((current) => 
        current === testimonials.length - 1 ? 0 : current + 1
      );
    }, 7000);
    
    return () => clearInterval(timer);
  }, []);

  // Don't render anything until client-side
  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-10 relative">
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Move to the next testimonial
  const nextTestimonial = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  // Move to the previous testimonial 
  const prevTestimonial = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        {/* Navigation Buttons */}
        <button
          onClick={prevTestimonial}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 z-10 transition-transform duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label={`Previous testimonial by ${testimonials[activeIndex].name}`}
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
          aria-label={`Next testimonial by ${testimonials[(activeIndex + 1) % testimonials.length].name}`}
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
                {/* Handle fallback for missing images */}
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg">
                  <OptimizedImage
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    fill
                    className="object-cover"
                    fallbackSrc="/images/placeholder-avatar.jpg"
                  />
                </div>
              </div>

              {/* Rating Stars */}
              <div className="flex gap-1 mb-2">
                {[...Array(testimonials[activeIndex].rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
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
                <p>&quot;{testimonials[activeIndex].text}&quot;</p>
              </blockquote>

              <div>
                <p className="font-bold text-lg text-gray-900">{testimonials[activeIndex].name}</p>
                <p className="text-gray-600">{testimonials[activeIndex].role}</p>
                <p className="text-blue-600 font-medium">{testimonials[activeIndex].course}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dots Navigation */}
      <div className="flex justify-center gap-3 mt-8">
        {testimonials.map((_, index) => (
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