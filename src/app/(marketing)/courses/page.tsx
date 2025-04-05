// src/app/(marketing)/courses/page.tsx
import { generateMetadata } from '@/utils/schema';
import Layout from '@/components/layout/Layout';
import Link from 'next/link';
import OptimizedImage from '@/components/OptimizedImage';

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

type CourseColor = 'blue' | 'indigo' | 'rose';

interface Course {
  id: string;
  title: string;
  level: string;
  language: string;
  schedule: string;
  description: string;
  icon: string;
  color: CourseColor;
  accent: string;
}

// Course data - in a real app this would come from a CMS or API
const courses = [
  {
    id: 'norwegian-a1',
    title: 'Norwegian Beginner Course (A1)',
    level: 'A1',
    language: 'Norwegian',
    schedule: 'Morning & Evening Classes',
    description: 'Start your Norwegian language journey with our comprehensive beginner course.',
    icon: '/images/icons/norwegian.png',
    color: 'blue',
    accent: 'emerald'
  },
  {
    id: 'business-english',
    title: 'Business English',
    level: 'B1-C1',
    language: 'English',
    schedule: 'Flexible Schedule',
    description: 'Enhance your professional English skills with our specialized business course.',
    icon: '/images/icons/english.png',
    color: 'indigo',
    accent: 'amber'
  },
  {
    id: 'spanish-a2',
    title: 'Spanish Elementary Course (A2)',
    level: 'A2',
    language: 'Spanish',
    schedule: 'Afternoon Classes',
    description: 'Build on your basic Spanish knowledge with our elementary level course.',
    icon: '/images/icons/spanish.png',
    color: 'rose',
    accent: 'violet'
  },
  {
    id: 'norwegian-a2',
    title: 'Norwegian Intermediate (A2)',
    level: 'A2',
    language: 'Norwegian',
    schedule: 'Evening Classes',
    description: 'Continue your Norwegian language development with our intermediate level course.',
    icon: '/images/icons/norwegian.png',
    color: 'blue',
    accent: 'cyan'
  },
  {
    id: 'conversational-english',
    title: 'Conversational English',
    level: 'A2-B2',
    language: 'English',
    schedule: 'Weekend Classes',
    description: 'Focus on speaking and listening skills in everyday situations.',
    icon: '/images/icons/english.png',
    color: 'indigo',
    accent: 'amber'
  },
  {
    id: 'spanish-b1',
    title: 'Spanish Intermediate (B1)',
    level: 'B1',
    language: 'Spanish',
    schedule: 'Morning Classes',
    description: 'Advance your Spanish skills with our comprehensive intermediate course.',
    icon: '/images/icons/spanish.png',
    color: 'rose',
    accent: 'amber'
  }
];

// Color mapping for course cards
const colorMap = {
  blue: {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100',
    border: 'border-border-default',
    heading: 'text-text-primary',
    hover: 'hover:border-blue-300 hover:shadow-blue-100',
    level: 'bg-blue-100 text-blue-700',
    button: 'bg-action-primary hover:bg-action-primaryHover'
  },
  indigo: {
    bg: 'bg-gradient-to-br from-indigo-50 to-indigo-100',
    border: 'border-border-default', 
    heading: 'text-text-primary',
    hover: 'hover:border-indigo-300 hover:shadow-indigo-100',
    level: 'bg-indigo-100 text-indigo-700',
    button: 'bg-indigo-600 hover:bg-indigo-700'
  },
  rose: {
    bg: 'bg-gradient-to-br from-rose-50 to-rose-100',
    border: 'border-border-default',
    heading: 'text-text-primary',
    hover: 'hover:border-rose-300 hover:shadow-rose-100',
    level: 'bg-rose-100 text-rose-700',
    button: 'bg-rose-600 hover:bg-rose-700'
  }
};

export default function CoursesPage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 text-white py-20">
        {/* Decorative background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", 
          backgroundSize: "20px 20px" 
        }}></div>
        
        {/* Decorative shapes */}
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white opacity-5 rounded-tr-full animate-float"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400 opacity-10 rounded-bl-full animate-float" style={{ animationDelay: "1.5s" }}></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight animate-fadeIn">
            Language Courses in Oslo
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-blue-100 animate-fadeIn delay-200">
            Whether you&apos;re starting your language journey or advancing your skills,
            our experienced teachers are here to guide you every step of the way.
          </p>
        </div>
      </section>

      {/* Course Listings */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-4">Expert Instruction</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary animate-fadeIn">Our Language Courses</h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto animate-fadeIn delay-100">
              Discover our range of language courses designed to help you achieve your language learning goals. 
              Get in touch to discuss your needs and find the perfect course for you.
            </p>
          </div>

          {/* Course List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {courses.map((course, index) => {
              const colors = colorMap[course.color as CourseColor];
              
              return (
                <div 
                  key={course.id}
                  className={`group relative rounded-xl p-6 border-2 ${colors.border} ${colors.bg} ${colors.hover} transition-all duration-300 hover:shadow-xl flex flex-col h-full transform hover:-translate-y-1 animate-fadeIn`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Language level badge */}
                  <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-semibold ${colors.level}`}>
                    {course.level}
                  </span>
                  
                  {/* Course header */}
                  <div className="flex items-start mb-4">
                    <div className="flex-shrink-0 mr-4">
                      <div className="w-14 h-14 rounded-full bg-background-primary shadow-sm flex items-center justify-center p-3 group-hover:bg-white transition-colors duration-300">
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
                      <h3 className={`text-xl font-bold mb-1 ${colors.heading} group-hover:text-action-primary transition-colors duration-300`}>{course.title}</h3>
                      <p className="text-text-secondary">{course.language}</p>
                    </div>
                  </div>
                  
                  {/* Course details */}
                  <div className="mb-6">
                    <div className="flex items-center mb-3">
                      <svg className="w-5 h-5 text-text-tertiary mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-text-secondary">{course.schedule}</span>
                    </div>
                    <p className="text-text-secondary">{course.description}</p>
                  </div>
                  
                  {/* Action button - grows to push to bottom with flex-col and flex-grow */}
                  <div className="mt-auto">
                    <Link 
                      href="/contact"
                      className={`block w-full py-3 px-4 rounded-lg text-center text-white font-medium transition-colors ${colors.button} transform hover:-translate-y-1 transition-all duration-300`}
                    >
                      Inquire Now
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -left-16 -top-16 w-64 h-64 bg-blue-100 rounded-full opacity-50 animate-float"></div>
        <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-blue-100 rounded-full opacity-50 animate-float" style={{ animationDelay: "2s" }}></div>
        
        <div className="relative container mx-auto px-4 text-center z-10">
          <div className="bg-background-primary p-8 md:p-12 rounded-2xl shadow-xl max-w-3xl mx-auto border border-border-default animate-fadeIn">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-text-primary">
              Not sure which course is right for you?
            </h2>
            <p className="text-lg text-text-secondary mb-8">
              Get in touch with us for a personalized recommendation based on your goals and current level.
            </p>
            <Link 
              href="/contact"
              className="inline-block bg-action-primary text-white px-8 py-4 rounded-lg font-semibold hover:bg-action-primaryHover transition-colors shadow-md transform hover:-translate-y-1 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-background-primary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 rounded-full mb-4">Our Advantages</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary animate-fadeIn">Why Choose Oslo Languages?</h2>
            <p className="text-lg text-text-secondary max-w-3xl mx-auto animate-fadeIn delay-100">
              We provide more than just language instruction. Here&apos;s what makes us different.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 border border-amber-200 relative overflow-hidden group hover:shadow-lg transition-all animate-fadeIn delay-100">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 opacity-20 rounded-bl-full group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 border-2 border-amber-200">
                  <svg className="w-8 h-8 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-text-primary group-hover:text-amber-800 transition-colors duration-300">Expert Teachers</h3>
                <p className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                  Learn from qualified native speakers with years of teaching experience. Our instructors are passionate about helping you succeed.
                </p>
              </div>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 border border-emerald-200 relative overflow-hidden group hover:shadow-lg transition-all animate-fadeIn delay-200">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 opacity-20 rounded-bl-full group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-200">
                  <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-text-primary group-hover:text-emerald-800 transition-colors duration-300">Small Class Sizes</h3>
                <p className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                  Maximum attention and speaking practice with classes limited to 12 students. Everyone gets a chance to participate.
                </p>
              </div>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-8 border border-violet-200 relative overflow-hidden group hover:shadow-lg transition-all animate-fadeIn delay-300">
              <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200 opacity-20 rounded-bl-full group-hover:scale-110 transition-transform"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6 border-2 border-violet-200">
                  <svg className="w-8 h-8 text-violet-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-4 text-text-primary group-hover:text-violet-800 transition-colors duration-300">Flexible Schedule</h3>
                <p className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                  Morning, afternoon, and evening classes to fit your schedule. Learn at your convenience without disrupting your routine.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Final CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 py-16 text-white">
        <div className="container mx-auto px-4 text-center animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Language Journey?</h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Get in touch today and take the first step toward achieving your language learning goals.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </Layout>
  );
}