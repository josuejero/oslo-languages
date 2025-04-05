// pages/about/_StatsSection.tsx
import React from 'react';

const StatsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {/* Stat 1 */}
          <div className="p-6 rounded-lg transform transition-transform hover:scale-105 animate-fadeIn delay-100">
            <div className="text-5xl font-bold mb-3">800+</div>
            <div className="text-blue-100 font-medium">Students Taught</div>
          </div>
          {/* Stat 2 */}
          <div className="p-6 rounded-lg transform transition-transform hover:scale-105 animate-fadeIn delay-200">
            <div className="text-5xl font-bold mb-3">15</div>
            <div className="text-blue-100 font-medium">Expert Teachers</div>
          </div>
          {/* Stat 3 */}
          <div className="p-6 rounded-lg transform transition-transform hover:scale-105 animate-fadeIn delay-300">
            <div className="text-5xl font-bold mb-3">98%</div>
            <div className="text-blue-100 font-medium">Student Satisfaction</div>
          </div>
          {/* Stat 4 */}
          <div className="p-6 rounded-lg transform transition-transform hover:scale-105 animate-fadeIn delay-400">
            <div className="text-5xl font-bold mb-3">8</div>
            <div className="text-blue-100 font-medium">Years Experience</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
