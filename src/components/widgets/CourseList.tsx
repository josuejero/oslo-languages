import React from 'react';
import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/card';

interface Course {
  id: string;
  title: string;
  level: string;
  language: string;
  schedule: string;
  description: string;
}

const courses: Course[] = [
  {
    id: 'norwegian-a1',
    title: 'Norwegian Beginner Course (A1)',
    level: 'A1',
    language: 'Norwegian',
    schedule: 'Morning & Evening Classes',
    description: 'Start your Norwegian language journey with our comprehensive beginner course.',
  },
  {
    id: 'business-english',
    title: 'Business English',
    level: 'B1-C1',
    language: 'English',
    schedule: 'Flexible Schedule',
    description: 'Enhance your professional English skills with our specialized business course.',
  },
  {
    id: 'spanish-a2',
    title: 'Spanish Elementary Course (A2)',
    level: 'A2',
    language: 'Spanish',
    schedule: 'Afternoon Classes',
    description: 'Build on your basic Spanish knowledge with our elementary level course.',
  },
];

export default function CourseList() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">Our Language Courses</h1>
      
      <p className="text-lg text-center mb-12 max-w-3xl mx-auto">
        Discover our range of language courses designed to help you achieve your language learning goals. 
        Contact us to discuss your needs and find the perfect course for you.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">{course.title}</h2>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {course.level}
                </span>
              </div>
            </CardHeader>
            
            <CardContent>
              <dl className="space-y-2 mb-6">
                <div className="flex justify-between">
                  <dt className="font-medium">Language:</dt>
                  <dd>{course.language}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="font-medium">Schedule:</dt>
                  <dd>{course.schedule}</dd>
                </div>
              </dl>
              
              <p className="text-gray-600 mb-6">{course.description}</p>
              
              <Link 
                href="/contact" 
                className="block w-full bg-blue-600 text-white text-center px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Inquire Now
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Not sure which course is right for you?</h2>
        <p className="text-lg mb-6">
          Get in touch with us for a personalized recommendation based on your goals and current level.
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