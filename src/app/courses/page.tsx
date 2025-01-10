// src/app/courses/page.tsx

import Image from 'next/image';
import Link from 'next/link';

import type { Metadata } from 'next';
import { PageProps } from '@/types/next';


export const metadata: Metadata = {
  title: 'Language Courses - Oslo Languages',
  description: 'Discover our range of language courses in Oslo. Learn Norwegian, English, Spanish and more with expert teachers and flexible schedules.',
  keywords: [
    'language courses oslo',
    'norwegian classes',
    'english courses norway',
    'spanish classes oslo',
    'language school norway',
    'business english oslo'
  ],
  openGraph: {
    title: 'Language Courses - Oslo Languages',
    description: 'Learn languages in Oslo with expert teachers and flexible schedules.',
    images: ['/og/courses.jpg'],
  },
};

type Course = {
  id: string;
  title: string;
  language: string;
  level: string;
  duration: string;
  schedule: string;
  price: string;
  description: string;
  image: string;
};


const courses: Course[] =  [
  {
    id: 'norwegian-beginner',
    title: 'Norwegian for Beginners (A1)',
    language: 'Norwegian',
    level: 'A1',
    duration: '10 weeks',
    schedule: 'Mon & Wed 18:00-20:00',
    price: 'NOK 8,500',
    description: 'Perfect for newcomers to Norway. Learn essential Norwegian for daily life.',
    image: '/courses/norwegian-a1.jpg'
  },
  {
    id: 'norwegian-intermediate',
    title: 'Intermediate Norwegian (B1)',
    language: 'Norwegian',
    level: 'B1',
    duration: '12 weeks',
    schedule: 'Tue & Thu 18:00-20:00',
    price: 'NOK 9,500',
    description: 'Advance your Norwegian with focus on conversation and workplace communication.',
    image: '/courses/norwegian-b1.jpg'
  },
  {
    id: 'business-english',
    title: 'Business English',
    language: 'English',
    level: 'B2-C1',
    duration: '8 weeks',
    schedule: 'Tue & Thu 17:00-19:00',
    price: 'NOK 7,500',
    description: 'Professional English for business contexts and workplace communication.',
    image: '/courses/business-english.jpg'
  },
  {
    id: 'spanish-beginner',
    title: 'Spanish for Beginners',
    language: 'Spanish',
    level: 'A1',
    duration: '10 weeks',
    schedule: 'Mon & Wed 17:00-19:00',
    price: 'NOK 7,500',
    description: 'Start your journey with Spanish in small, interactive groups.',
    image: '/courses/spanish-a1.jpg'
  }
];

const ITEMS_PER_PAGE = 6;


export default function CoursesPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  // Get current page from URL params or default to 1
  const currentPage = Number(searchParams?.page) || 1;
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE);

  // Calculate pagination bounds
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentCourses = courses.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Our Language Courses</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Choose from our range of language courses taught by experienced native speakers.
          All courses include study materials and certification upon completion.
        </p>
      </div>

      {/* Course Filter */}
      <div className="flex flex-wrap gap-4 mb-8 justify-center">
        <button className="px-4 py-2 rounded-full bg-blue-600 text-white">
          All Courses
        </button>
        <button className="px-4 py-2 rounded-full border border-gray-300 hover:border-blue-600">
          Norwegian
        </button>
        <button className="px-4 py-2 rounded-full border border-gray-300 hover:border-blue-600">
          English
        </button>
        <button className="px-4 py-2 rounded-full border border-gray-300 hover:border-blue-600">
          Spanish
        </button>
      </div>

      {/* Course Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentCourses.map((course) => (
          <div 
            key={course.id} 
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="relative h-48">
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">{course.title}</h2>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">
                  {course.level}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                <p className="text-gray-700">{course.description}</p>
                <div className="text-sm text-gray-700">
                  <p><span className="font-medium">Duration:</span> {course.duration}</p>
                  <p><span className="font-medium">Schedule:</span> {course.schedule}</p>
                  <p className="font-semibold text-gray-900">Price: {course.price}</p>
                </div>
              </div>
              <Link 
                href={`/courses/${course.id}`}
                className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <Link
            href={`/courses?page=${Math.max(1, currentPage - 1)}`}
            className={`px-4 py-2 rounded-md ${
              currentPage === 1
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-disabled={currentPage === 1}
          >
            Previous
          </Link>
          
          {[...Array(totalPages)].map((_, i) => (
            <Link
              key={i + 1}
              href={`/courses?page=${i + 1}`}
              className={`px-4 py-2 rounded-md ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {i + 1}
            </Link>
          ))}

          <Link
            href={`/courses?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`px-4 py-2 rounded-md ${
              currentPage === totalPages
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            aria-disabled={currentPage === totalPages}
          >
            Next
          </Link>
        </div>
      )}

      {/* Call to Action */}
      <div className="mt-16 text-center bg-gray-50 rounded-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-900">Not sure which course to choose?</h2>
        <p className="text-gray-600 mb-6">
          Contact us for a free consultation and level assessment.
        </p>
        <Link
          href="/contact"
          className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  );
}