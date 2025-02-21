/**
 * @file Testimonials.tsx
 * @description Displays a carousel of student testimonials.
 *
 * Allows users to navigate through multiple testimonials, each with a name,
 * role, course, text, and rating.
 */

'use client';

import { useState } from 'react';
import OptimizedImage from '@/components/OptimizedImage';
import Section from '../layout/Section';

/**
 * The Testimonial type represents a single student review with
 * an ID, name, role, image path, course, text content, and a rating (1-5).
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

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  /**
   * Move to the next testimonial, or wrap around to the first if at the end.
   */
  const nextTestimonial = () => {
    setActiveIndex((current) =>
      current === testimonials.length - 1 ? 0 : current + 1
    );
  };

  /**
   * Move to the previous testimonial, or wrap around to the last if at the start.
   */
  const prevTestimonial = () => {
    setActiveIndex((current) =>
      current === 0 ? testimonials.length - 1 : current - 1
    );
  };

  return (
    /**
     * Replaced "bg-bg-tertiary" with "bg-tertiary"
     * for consistency with updated Tailwind color tokens.
     */
    <div className="bg-tertiary">
      <Section className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          What Our Students Say
        </h2>

        <div className="max-w-4xl mx-auto">
          <div className="relative">
            {/* Navigation Buttons */}
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 bg-secondary p-2 rounded-full shadow-lg hover:bg-gray-100"
              aria-label={`Previous testimonial by ${testimonials[activeIndex].name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 bg-secondary p-2 rounded-full shadow-lg hover:bg-gray-100"
              aria-label={`Next testimonial by ${testimonials[activeIndex].name}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-primary"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Testimonial Card */}
            <div className="bg-secondary rounded-2xl shadow-xl p-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative w-20 h-20 mb-4">
                  <OptimizedImage
                    src={testimonials[activeIndex].image}
                    alt={testimonials[activeIndex].name}
                    fill
                    className="rounded-full object-cover"
                    aspectRatio={1}
                    sizes="80px"
                    background="bg-tertiary"
                    lazyBoundary="200px"
                    lowQualityPlaceholder={`${testimonials[activeIndex].image}?w=10`}
                  />
                </div>

                {/* Rating Stars */}
                <div className="flex gap-1 mb-4">
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

                <blockquote className="text-lg mb-4 text-primary">
                  &quot;{testimonials[activeIndex].text}&quot;
                </blockquote>

                <div className="text-secondary">
                  <p className="font-semibold">{testimonials[activeIndex].name}</p>
                  <p className="text-sm">{testimonials[activeIndex].role}</p>
                  <p className="text-accent-primary text-sm">{testimonials[activeIndex].course}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Dots Navigation */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-accent-primary' : 'bg-secondary'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              >
                <span className="sr-only">Testimonial {index + 1}</span>
              </button>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
