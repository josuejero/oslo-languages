import { useMemo } from 'react';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Course } from '@/types';

interface CourseDetailsProps {
  course: Course;
  onEdit?: () => void;
  isAdmin?: boolean;
}

export default function CourseDetails({ course, onEdit, isAdmin = false }: CourseDetailsProps) {
  const startDate = useMemo(() => {
    return new Date(course.startDate).toLocaleDateString('en-NO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }, [course.startDate]);

  const isEnrollmentOpen = useMemo(() => {
    const now = new Date();
    const courseStart = new Date(course.startDate);
    return now < courseStart;
  }, [course.startDate]);

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Course Header */}
      <div className="relative h-[300px]">
        <OptimizedImage
          src={course.imageUrl || '/images/course-placeholder.jpg'}
          alt={course.title}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>

      <div className="p-6">
        {/* Title and Admin Actions */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
          {isAdmin && (
            <button
              onClick={onEdit}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Edit Course
            </button>
          )}
        </div>

        {/* Course Metadata */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Course Details</h2>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Language:</span>
                  <span className="font-medium">{course.language}</span>
                </li>
                <li className="flex justify-between">
                  <span>Level:</span>
                  <span className="font-medium">{course.level}</span>
                </li>
                <li className="flex justify-between">
                  <span>Duration:</span>
                  <span className="font-medium">{course.duration}</span>
                </li>
                <li className="flex justify-between">
                  <span>Schedule:</span>
                  <span className="font-medium">{course.schedule}</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-900">Enrollment</h2>
              <ul className="mt-2 space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Start Date:</span>
                  <span className="font-medium">{startDate}</span>
                </li>
                <li className="flex justify-between">
                  <span>Maximum Students:</span>
                  <span className="font-medium">{course.maxStudents}</span>
                </li>
                <li className="flex justify-between">
                  <span>Price:</span>
                  <span className="font-medium">NOK {course.price}</span>
                </li>
              </ul>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
            <p className="text-gray-600 whitespace-pre-line">{course.description}</p>
          </div>
        </div>

        {/* Enrollment Status and Actions */}
        <div className="border-t pt-6">
          {isEnrollmentOpen ? (
            <div className="space-y-4">
              <Alert>
                <AlertDescription>
                  Enrollment is open for this course starting {startDate}
                </AlertDescription>
              </Alert>
              <div className="flex gap-4">
                <Link
                  href={`/contact?course=${course.id}`}
                  className="flex-1 px-6 py-3 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700"
                >
                  Enroll Now
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 text-center rounded-md hover:bg-blue-50"
                >
                  Request Information
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <Alert variant="warning">
                <AlertDescription>
                  Enrollment for this course has closed. Please check our other available courses
                  or contact us for information about future dates.
                </AlertDescription>
              </Alert>
              <div className="flex gap-4">
                <Link
                  href="/courses"
                  className="flex-1 px-6 py-3 bg-blue-600 text-white text-center rounded-md hover:bg-blue-700"
                >
                  View Other Courses
                </Link>
                <Link
                  href="/contact"
                  className="flex-1 px-6 py-3 border border-blue-600 text-blue-600 text-center rounded-md hover:bg-blue-50"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}