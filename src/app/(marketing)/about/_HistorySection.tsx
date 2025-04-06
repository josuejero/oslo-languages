// src/app/(marketing)/about/_HistorySection.tsx

import React from 'react';
import OptimizedImage from '@/components/common/media/OptimizedImage';

interface HistorySectionProps {
  coverImage: string;
}

const HistorySection: React.FC<HistorySectionProps> = ({ coverImage }) => {
  return (
    <section className="py-12 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 animate-fadeIn">
            <div className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-800 rounded-full mb-2">
              Established 2015
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary leading-tight">
              Our <span className="text-action-primary">Story</span>
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed">
              Founded in 2015, Oslo Languages has grown to become one of Oslo's
              leading language schools, specializing in Norwegian, English, and
              Spanish instruction.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              Our mission is to provide high-quality language education through
              engaging, practical, and culturally enriching courses.
            </p>
            <p className="text-lg text-text-secondary leading-relaxed">
              Located in central Oslo, we serve both individuals and corporate
              clients, offering flexible learning options including in-person
              and online courses.
            </p>
          </div>

          {/* Image */}
          <div className="relative animate-fadeIn delay-200">
            <div className="absolute -right-6 -bottom-6 w-full h-full border-4 border-blue-100 rounded-lg -z-10 animate-float"></div>
            <div
              className="absolute -left-6 -top-6 w-24 h-24 bg-blue-100 rounded-full -z-10 animate-float"
              style={{ animationDelay: '1s' }}
            ></div>

            <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl transform transition-transform duration-500 hover:scale-105 group">
              <OptimizedImage
                src={coverImage}
                alt="Oslo Languages School"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
                aspectRatio={16 / 9}
                sizes="(max-width: 768px) 100vw, 600px"
                background="bg-gray-100"
                lowQualityPlaceholder={`${coverImage}?w=20`}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HistorySection;