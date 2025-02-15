// src/app/courses/[courseId]/page.tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { PageProps } from '@/types/next';
import OptimizedImage from '@/components/OptimizedImage';

const courseDetails = {
  'norwegian-beginner': {
    title: 'Norwegian for Beginners (A1)',
    language: 'Norwegian',
    level: 'A1',
    duration: '10 weeks',
    schedule: 'Mon & Wed 18:00-20:00',
    price: 'NOK 8,500',
    description: 'Perfect for newcomers to Norway. Learn essential Norwegian for daily life.',
    image: '/courses/norwegian-a1.jpg',
    syllabus: [
      'Basic grammar and pronunciation',
      'Everyday conversations',
      'Numbers and basic mathematics',
      'Shopping and ordering food',
      'Introducing yourself and family',
      'Basic workplace communication',
    ],
    includes: [
      'Course materials and textbook',
      'Online learning platform access',
      'Progress tests and feedback',
      'Course completion certificate',
      '2 one-on-one sessions with teacher',
    ],
    upcomingDates: [
      'January 15, 2024 - March 20, 2024',
      'March 1, 2024 - May 10, 2024',
      'April 15, 2024 - June 25, 2024',
    ],
  },
};

type Props = {
  params: { courseId: string };
};

export default function CoursePage({ params }: PageProps) {
  const course = courseDetails[params.courseId as keyof typeof courseDetails];

  if (!course) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12 bg-gray-50">
      {/* Course Header */}
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          {/* CHANGED: Replaced Image with OptimizedImage */}
          <OptimizedImage
            src={course.image}
            alt={course.title}
            fill
            className="object-cover"
            aspectRatio={16/9}
            sizes="(max-width: 768px) 100vw, 600px"
            background="bg-gray-100"
            lowQualityPlaceholder={`${course.image}?w=20`}
          />
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{course.title}</h1>
          <div className="flex gap-2">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded">
              {course.level}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded">
              {course.language}
            </span>
          </div>
          <p className="text-xl text-gray-600">{course.description}</p>
          <div className="space-y-2 text-gray-600">
            <p>Duration: {course.duration}</p>
            <p>Schedule: {course.schedule}</p>
            <p className="text-2xl font-bold text-gray-900">{course.price}</p>
          </div>
          <Link 
            href={`/contact?course=${params.courseId}`}
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Register Interest
          </Link>
        </div>
      </div>

      {/* Course Details */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Syllabus */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Course Syllabus</h2>
          <ul className="space-y-2">
            {course.syllabus.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-blue-600 mr-2">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* What's Included */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">What&apos;s Included</h2>
          <ul className="space-y-2">
            {course.includes.map((item, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-green-600 mr-2">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Upcoming Dates */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Upcoming Course Dates</h2>
          <ul className="space-y-2">
            {course.upcomingDates.map((date, index) => (
              <li key={index} className="flex items-start text-gray-700">
                <span className="text-gray-600 mr-2">📅</span>
                {date}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6 text-gray-900">Frequently Asked Questions</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-2 text-gray-900">What level is this course for?</h3>
            <p className="text-gray-600">This course is designed for {course.level} level students. Not sure about your level? Contact us for a free assessment.</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-bold mb-2 text-gray-900">How many students are in each class?</h3>
            <p className="text-gray-600">We maintain small class sizes with a maximum of 12 students to ensure quality interaction and personal attention.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function generateMetadata({ params }: Props): Metadata {
  const course = courseDetails[params.courseId as keyof typeof courseDetails];

  if (!course) {
    return {
      title: 'Course Not Found - Oslo Languages',
    };
  }

  return {
    title: `${course.title} - Oslo Languages`,
    description: course.description,
    openGraph: {
      title: `${course.title} - Oslo Languages`,
      description: course.description,
      images: [course.image],
    },
    keywords: [
      'language course oslo',
      'learn ' + course.language.toLowerCase(),
      course.language.toLowerCase() + ' classes oslo',
      'language school norway',
      course.level + ' ' + course.language.toLowerCase(),
    ],
  };
}