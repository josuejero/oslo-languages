// src/pages/courses/index.tsx
import { generateMetadata } from '@/utils/schema';
import CourseList from '@/components/widgets/CourseList';
import Layout from '@/components/layout/Layout';

export const metadata = generateMetadata({
  title: 'Language Courses',
  description: 'Explore our Norwegian, English, and Spanish language courses in Oslo. From beginner to advanced levels, find the perfect course for your language learning journey.',
  keywords: [
    'language courses oslo',
    'norwegian classes',
    'english courses norway',
    'spanish lessons oslo',
    'language learning',
    'oslo language school'
  ]
});

export default function CoursesPage() {
  return (
    <Layout>
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Language Courses in Oslo
          </h1>
          <p className="text-xl max-w-3xl mx-auto">
            Whether you&apos;re starting your language journey or advancing your skills,
            our experienced teachers are here to guide you every step of the way.
          </p>
        </div>
      </section>

      <CourseList />

      <section className="bg-gray-50 py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Why Choose Oslo Languages?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Expert Teachers</h3>
              <p className="text-gray-600">
                Learn from qualified native speakers with years of teaching experience.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Small Class Sizes</h3>
              <p className="text-gray-600">
                Maximum attention and speaking practice with classes limited to 12 students.
              </p>
            </div>
            
            <div className="text-center">
              <h3 className="text-xl font-bold mb-4">Flexible Schedule</h3>
              <p className="text-gray-600">
                Morning, afternoon, and evening classes to fit your schedule.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}