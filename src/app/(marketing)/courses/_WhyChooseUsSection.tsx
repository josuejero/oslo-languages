
import React from 'react';

const WhyChooseUsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-background-primary">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block px-3 py-1 text-sm font-medium bg-amber-100 text-amber-800 rounded-full mb-4">
            Our Advantages
          </span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-text-primary animate-fadeIn">
            Why Choose Oslo Languages?
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto animate-fadeIn delay-100">
            We provide more than just language instruction. Here&apos;s what makes us different.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {}
          <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-8 border border-amber-200 relative overflow-hidden group hover:shadow-lg transition-all animate-fadeIn delay-100">
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200 opacity-20 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 border-2 border-amber-200">
                <svg
                  className="w-8 h-8 text-amber-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary group-hover:text-amber-800 transition-colors duration-300">
                Expert Teachers
              </h3>
              <p className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                Learn from qualified native speakers with years of teaching experience.
                Our instructors are passionate about helping you succeed.
              </p>
            </div>
          </div>

          {}
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-8 border border-emerald-200 relative overflow-hidden group hover:shadow-lg transition-all animate-fadeIn delay-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 opacity-20 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-6 border-2 border-emerald-200">
                <svg
                  className="w-8 h-8 text-emerald-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary group-hover:text-emerald-800 transition-colors duration-300">
                Small Class Sizes
              </h3>
              <p className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                Maximum attention and speaking practice with classes limited to 12 students.
                Everyone gets a chance to participate.
              </p>
            </div>
          </div>

          {}
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 rounded-xl p-8 border border-violet-200 relative overflow-hidden group hover:shadow-lg transition-all animate-fadeIn delay-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-violet-200 opacity-20 rounded-bl-full group-hover:scale-110 transition-transform"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-violet-100 rounded-full flex items-center justify-center mb-6 border-2 border-violet-200">
                <svg
                  className="w-8 h-8 text-violet-700"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4 text-text-primary group-hover:text-violet-800 transition-colors duration-300">
                Flexible Schedule
              </h3>
              <p className="text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                Morning, afternoon, and evening classes to fit your schedule.
                Learn at your convenience without disrupting your routine.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUsSection;