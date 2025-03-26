// src/pages/about.tsx

import { generateMetadata } from '@/utils/schema';
import OptimizedImage from '@/components/OptimizedImage';
import { post, teachers } from '@/data/about';
import Layout from '@/components/layout/Layout';
import { useState } from 'react';

export const metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about Oslo Languages, our expert teachers, and our proven teaching methodology. Established in 2015, we are one of Oslo\'s leading language schools.',
  keywords: [
    'language school oslo',
    'norwegian teachers',
    'english teachers oslo', 
    'spanish teachers norway',
    'about oslo languages',
    'language teaching methodology'
  ],
  image: '/og/about.jpg'
});

export default function AboutPage() {
  // State for card hover effects
  const [activeTeacher, setActiveTeacher] = useState<number | null>(null);

  return (
    <Layout>
      {/* Hero Section with animated gradient background */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-90"></div>
        
        {/* Decorative patterns */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", 
          backgroundSize: "20px 20px"
        }}></div>

        <div className="container relative mx-auto px-6 z-10">
          <div className="text-center mb-6">
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
              About <span className="text-yellow-300">Oslo Languages</span>
            </h1>
            <div className="w-24 h-1 bg-yellow-300 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
            <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,80C1120,96,1280,96,1360,96L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* History Section with image */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
                Established 2015
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                Our <span className="text-blue-600">Story</span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                Founded in 2015, Oslo Languages has grown to become one of Oslo&apos;s leading 
                language schools, specializing in Norwegian, English, and Spanish instruction.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Our mission is to provide high-quality language education through 
                engaging, practical, and culturally enriching courses that prepare 
                students for real-world communication.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                Located in central Oslo, we serve both individuals and corporate 
                clients, offering flexible learning options including in-person 
                and online courses.
              </p>
            </div>

            <div className="relative">
              {/* Decorative elements */}
              <div className="absolute -right-6 -bottom-6 w-full h-full border-4 border-blue-100 rounded-lg -z-10"></div>
              <div className="absolute -left-6 -top-6 w-24 h-24 bg-blue-100 rounded-full -z-10"></div>
              
              <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105">
                <OptimizedImage
                  src={post.coverImage}
                  alt="Oslo Languages School"
                  fill
                  className="object-cover"
                  priority
                  aspectRatio={16/9}
                  sizes="(max-width: 768px) 100vw, 600px"
                  background="bg-gray-100"
                  lowQualityPlaceholder={`${post.coverImage}?w=20`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Teaching Methodology Section with cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100 rounded-full opacity-30 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-100 rounded-full opacity-30 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 text-sm font-medium bg-indigo-100 text-indigo-800 rounded-full mb-2">
              How We Teach
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Teaching <span className="text-indigo-600">Methodology</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Our approach combines proven language teaching methods with innovative practices 
              to create an effective and engaging learning experience.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Method 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-blue-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Communicative Approach</h3>
              <p className="text-gray-600">
                We emphasize practical communication skills through interactive activities, 
                role-play, and real-world scenarios.
              </p>
            </div>

            {/* Method 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-indigo-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-indigo-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Small Group Sizes</h3>
              <p className="text-gray-600">
                Classes are limited to 12 students to ensure individual attention and 
                maximize speaking practice opportunities.
              </p>
            </div>

            {/* Method 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg border-t-4 border-purple-600 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-gray-900">Cultural Integration</h3>
              <p className="text-gray-600">
                Language learning is combined with cultural insights to provide a 
                comprehensive understanding of the target language.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Meet Our Teachers Section with animated cards */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full mb-2">
              Our Experts
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Meet Our <span className="text-purple-600">Teachers</span>
            </h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600">
              Our passionate teachers bring language learning to life with their expertise 
              and cultural knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {teachers.map((teacher, index) => (
              <div 
                key={index}
                className="relative transform transition-all duration-300 hover:-translate-y-2"
                onMouseEnter={() => setActiveTeacher(index)}
                onMouseLeave={() => setActiveTeacher(null)}
              >
                <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ${activeTeacher === index ? 'ring-4 ring-purple-400' : ''}`}>
                  <div className="relative h-80">
                    <OptimizedImage
                      src={teacher.image}
                      alt={teacher.name}
                      fill
                      className="object-cover transition-transform duration-700 hover:scale-110"
                      aspectRatio={1}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                      background="bg-gray-100"
                      lowQualityPlaceholder={`${teacher.image}?w=20`}
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-1 text-gray-900">{teacher.name}</h3>
                    <p className="text-purple-600 text-lg font-medium mb-3">{teacher.role}</p>
                    <p className="text-gray-600 mb-4">{teacher.bio}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {teacher.languages.map((language, i) => (
                        <span 
                          key={i}
                          className="inline-block px-3 py-1 text-sm font-medium bg-gray-100 text-gray-800 rounded-full"
                        >
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with animated counters */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {/* Stat 1 */}
            <div className="p-6 rounded-lg transform transition-transform hover:scale-105">
              <div className="text-5xl font-bold mb-3">800+</div>
              <div className="text-blue-100 font-medium">Students Taught</div>
            </div>
            
            {/* Stat 2 */}
            <div className="p-6 rounded-lg transform transition-transform hover:scale-105">
              <div className="text-5xl font-bold mb-3">15</div>
              <div className="text-blue-100 font-medium">Expert Teachers</div>
            </div>
            
            {/* Stat 3 */}
            <div className="p-6 rounded-lg transform transition-transform hover:scale-105">
              <div className="text-5xl font-bold mb-3">98%</div>
              <div className="text-blue-100 font-medium">Student Satisfaction</div>
            </div>
            
            {/* Stat 4 */}
            <div className="p-6 rounded-lg transform transition-transform hover:scale-105">
              <div className="text-5xl font-bold mb-3">8</div>
              <div className="text-blue-100 font-medium">Years Experience</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
            Ready to start your language journey?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Contact us today to learn more about our courses and find the perfect fit for your language goals.
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:-translate-y-1 transition-all duration-300"
          >
            Contact Us
          </a>
        </div>
      </section>
    </Layout>
  );
}