
'use client'; 

import { useState } from 'react';
import OptimizedImage from '@/components/common/media/OptimizedImage';

interface Teacher {
  name: string;
  role: string;
  bio: string;
  image: string;
  languages: string[];
}

interface TeachersSectionClientProps {
  teachers: Teacher[];
}

export default function TeachersSectionClient({ teachers }: TeachersSectionClientProps) {
  
  const [activeTeacher, setActiveTeacher] = useState<number | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 animate-fadeIn">
          <div className="inline-block px-3 py-1 text-sm font-medium bg-purple-100 text-purple-800 rounded-full mb-2">
            Our Experts
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Meet Our <span className="text-purple-600">Teachers</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-text-secondary">
            Our passionate teachers bring language learning to life.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {teachers.map((teacher, index) => (
            <div
              key={index}
              className="relative transform transition-all duration-300 hover:-translate-y-2 animate-fadeIn"
              style={{ animationDelay: `${(index + 1) * 150}ms` }}
              onMouseEnter={() => setActiveTeacher(index)}
              onMouseLeave={() => setActiveTeacher(null)}
            >
              <div
                className={`bg-background-primary rounded-xl shadow-lg overflow-hidden transition-all duration-500 ${
                  activeTeacher === index ? 'ring-4 ring-purple-400' : ''
                }`}
              >
                <div className="relative h-80 group">
                <OptimizedImage
  src="/images/placeholder.png"
  alt={teacher.name}
  fill
  className="object-cover transition-transform duration-700 group-hover:scale-110"
  aspectRatio={1}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px"
  background="bg-gray-100"
/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-1 text-text-primary">
                    {teacher.name}
                  </h3>
                  <p className="text-purple-600 text-lg font-medium mb-3">
                    {teacher.role}
                  </p>
                  <p className="text-text-secondary mb-4">{teacher.bio}</p>
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
  );
}