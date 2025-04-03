// src/app/about/page.tsx
import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About Oslo Languages | Our History and Methodology",
  description: "Learn about our teaching philosophy, experienced instructors, and proven results in language education.",
};

export default function About() {
  return (
    <>
      {/* School History Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-12 text-center">About Oslo Languages</h1>
          
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Our Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="mb-4">
                  Founded in 2015, Oslo Languages started as a small Norwegian language school for expatriates.
                  Our founder, Anna Johansen, recognized the challenges newcomers faced when integrating into Norwegian society.
                </p>
                <p>
                  What began with just two classrooms has grown into Oslo&apos;s premier language education center,
                  offering Norwegian, English, and Spanish courses for students of all backgrounds and proficiency levels.
                </p>
              </div>
              <div className="relative h-64 w-full">
                <Image 
                  src="/images/school-building.jpg" 
                  alt="Oslo Languages Building" 
                  fill
                  className="object-cover rounded-lg"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
          
          {/* Teaching Methodology Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Our Teaching Methodology</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-medium mb-3">Conversation-Focused</h3>
                <p>Our approach emphasizes practical conversation skills from day one, ensuring you can apply what you learn immediately.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-medium mb-3">Small Class Sizes</h3>
                <p>With a maximum of 8 students per class, we ensure personalized attention and ample speaking opportunities.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-medium mb-3">Cultural Integration</h3>
                <p>Language learning goes beyond vocabulary—we integrate cultural context to help you truly understand and connect.</p>
              </div>
            </div>
          </div>
          
          {/* Teacher Profiles Section */}
          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-6">Meet Our Teachers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Teacher 1 */}
              <div className="bg-white p-6 rounded-lg shadow text-center">
                <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden">
                  <Image 
                    src="/images/teacher-1.jpg" 
                    alt="Maria Berg" 
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-medium">Maria Berg</h3>
                <p className="text-gray-600 mb-2">Norwegian Instructor</p>
                <p className="text-sm">Native speaker with 12 years of teaching experience. Specializes in beginner and intermediate courses.</p>
              </div>
              
              {/* More teachers would go here */}
            </div>
          </div>
          
          {/* Achievements Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">Our Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-4xl font-bold text-blue-500">3,500+</p>
                <p className="text-gray-600">Students Taught</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-4xl font-bold text-blue-500">95%</p>
                <p className="text-gray-600">Success Rate</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-4xl font-bold text-blue-500">15</p>
                <p className="text-gray-600">Certified Teachers</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-4xl font-bold text-blue-500">8</p>
                <p className="text-gray-600">Years of Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}