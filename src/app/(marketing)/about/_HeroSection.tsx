

import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => {
  return (
    <section className="relative py-20 overflow-hidden">
      {}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 opacity-90"></div>

      {}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
          backgroundSize: '20px 20px',
        }}
      ></div>

      <div className="container relative mx-auto px-6 z-10">
        <div className="text-center mb-6 animate-fadeIn">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight leading-tight">
            {title}
          </h1>
          <div className="w-24 h-1 bg-yellow-300 mx-auto rounded-full"></div>
          <p className="text-lg text-white mt-4">{subtitle}</p>
        </div>
      </div>

      {}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 120"
          fill="#ffffff"
        >
          <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,80C1120,96,1280,96,1360,96L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;