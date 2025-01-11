// src/app/about/page.tsx

import { generateMetadata } from '@/lib/schema';
import OptimizedImage from '@/components/OptimizedImage';
import { post, teachers } from '../../data';

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
  return (
    <div className="container mx-auto px-4 py-12">
      {/* History Section */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold mb-4 text-center">About Oslo Languages</h1>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <p className="text-lg">
              Founded in 2015, Oslo Languages has grown to become one of Oslo&apos;s leading 
              language schools, specializing in Norwegian, English, and Spanish instruction.
            </p>
            <p className="text-lg">
              Our mission is to provide high-quality language education through 
              engaging, practical, and culturally enriching courses that prepare 
              students for real-world communication.
            </p>
            <p className="text-lg">
              Located in central Oslo, we serve both individuals and corporate 
              clients, offering flexible learning options including in-person 
              and online courses.
            </p>
          </div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <OptimizedImage
              src={post.coverImage}
              alt={post.title}
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
      </section>

      {/* Methodology Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Our Teaching Methodology</h2>
        <div className="grid md:grid-cols-3 gap-8 text-gray-800">
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Communicative Approach</h3>
            <p>
              We emphasize practical communication skills through interactive 
              activities, role-play, and real-world scenarios.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Small Group Sizes</h3>
            <p>
              Classes are limited to 12 students to ensure individual attention 
              and maximize speaking practice opportunities.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Cultural Integration</h3>
            <p>
              Language learning is combined with cultural insights to provide 
              a comprehensive understanding of the target language.
            </p>
          </div>
        </div>
      </section>

      {/* Teachers Section */}
      <section className="mb-20">
        <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Teachers</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teachers.map((teacher, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                <OptimizedImage
                  src={teacher.image}
                  alt={teacher.name}
                  fill
                  className="object-cover"
                  aspectRatio={1}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
                  background="bg-gray-100"
                  lazyBoundary="300px"
                  lowQualityPlaceholder={`${teacher.image}?w=20`}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{teacher.name}</h3>
                <p className="text-blue-600 mb-2">{teacher.role}</p>
                <p className="text-gray-600 mb-4">{teacher.bio}</p>
                <div className="flex flex-wrap gap-2">
                  {teacher.languages.map((language, i) => (
                    <span 
                      key={i}
                      className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 text-white py-12 rounded-lg">
        <div className="grid md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">800+</div>
            <div>Students Taught</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">15</div>
            <div>Expert Teachers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">98%</div>
            <div>Student Satisfaction</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">8</div>
            <div>Years Experience</div>
          </div>
        </div>
      </section>
    </div>
  );
}