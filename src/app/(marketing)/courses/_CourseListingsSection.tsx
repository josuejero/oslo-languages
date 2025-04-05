// src/app/(marketing)/courses/_CourseListingsSection.tsx
import React from 'react';
import { courses } from './courseData';          // Imported data
import CourseCard from './CourseCard';           // Reusable component

const CourseListingsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">
            Expert Instruction
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary animate-fadeIn">
            Our Language Courses
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto animate-fadeIn delay-100">
            Discover our range of language courses designed to help you achieve your language learning goals.
            Get in touch to discuss your needs and find the perfect course for you.
          </p>
        </div>

        {/* Course cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {courses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CourseListingsSection;
