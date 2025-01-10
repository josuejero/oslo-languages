// src/app/page.tsx

import Image from "next/image";
import Link from "next/link";
import Testimonials from '@/components/widgets/Testimonials';
import { features } from '@/data';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Learn Languages in the Heart of Oslo
            </h1>
            <p className="text-xl mb-8">
              Join Oslo&apos;s premier language school offering Norwegian, English, Spanish and more.
              Expert teachers, flexible schedules, and proven learning methods.
            </p>
            <Link 
              href="/courses"
              className="bg-bg-secondary text-accent-primary px-8 py-3 rounded-lg font-semibold hover:bg-accent-secondary transition-colors"
            >
              Explore Our Courses
            </Link>
          </div>
        </div>
      </section>
      
      <Testimonials />
      
      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-text-primary">Our Language Courses</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-bg-secondary p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 mb-4">
                  <Image
                    src={feature.icon}
                    alt={feature.title}
                    width={48}
                    height={48}
                  />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-text-primary">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-bg-tertiary py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-text-primary">Ready to Start Your Language Journey?</h2>
          <p className="text-xl text-text-secondary mb-8">
            Contact us today to discuss your language learning goals and find the perfect course for you.
          </p>
          <div className="space-x-4">
            <Link 
              href="/contact"
              className="bg-accent-primary text-white px-8 py-3 rounded-lg font-semibold hover:bg-accent-secondary transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/courses" 
              className="border border-accent-primary text-accent-primary px-8 py-3 rounded-lg font-semibold hover:bg-bg-secondary transition-colors"
            >
              View Courses
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}