
import React from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/common/media/OptimizedImage';
import { Course } from './courseData';
import { colorMap } from './courseStyles';

interface CourseCardProps {
  course: Course;
  index: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, index }) => {
  const colors = colorMap[course.color];

  return (
    <div
      key={course.id}
      className={`group relative rounded-xl p-6 border-2 ${colors.border} ${colors.bg} ${colors.hover} 
                  transition-all duration-300 hover:shadow-xl flex flex-col h-full transform hover:-translate-y-1 
                  animate-fadeIn`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {}
      <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${colors.level}`}>
        {course.level}
      </span>

      {}
      <div className="flex items-start mb-4">
        <div className="flex-shrink-0 mr-4">
          <div className="w-14 h-14 rounded-full bg-background-primary shadow-sm flex items-center justify-center p-3 
                          group-hover:bg-white transition-colors duration-300"
          >
            <OptimizedImage
              src={course.icon}
              alt={course.language}
              width={32}
              height={32}
              className="w-full h-full object-contain"
            />
          </div>
        </div>
        <div>
          <h3
            className={`text-xl font-bold mb-1 ${colors.heading} group-hover:text-action-primary transition-colors duration-300`}
          >
            {course.title}
          </h3>
          <p className="text-text-secondary">{course.language}</p>
        </div>
      </div>

      {}
      <div className="mb-6">
        <div className="flex items-center mb-3">
          <svg
            className="w-5 h-5 text-text-tertiary mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="text-text-secondary">{course.schedule}</span>
        </div>
        <p className="text-text-secondary">{course.description}</p>
      </div>

      {}
      <div className="mt-auto">
        <Link
          href="/contact"
          className={`block w-full py-3 px-4 rounded-lg text-center text-white font-medium transition-colors 
                      ${colors.button} transform hover:-translate-y-1 transition-all duration-300`}
        >
          Inquire Now
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;