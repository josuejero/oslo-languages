import Link from "next/link";
import OptimizedImage from '@/components/OptimizedImage';
import Testimonials from '@/components/widgets/Testimonials';
import { features } from '@/data';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Enhanced Hero Section with Gradient */}
      <section className="relative overflow-hidden py-20 md:py-28">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 opacity-90"></div>
        
        {/* Static background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", 
          backgroundSize: "20px 20px" 
        }}></div>
        
        <div className="container relative mx-auto px-6 z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight">
              Learn Languages in the 
              <span className="block text-yellow-300">Heart of Oslo</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Join Oslo&apos;s premier language school offering Norwegian, English, Spanish and more.
              Expert teachers, flexible schedules, and proven learning methods.
            </p>
            <div>
              <Link 
                href="/courses"
                className="inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-yellow-300 hover:text-blue-800 transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Our Courses
              </Link>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden md:block absolute right-0 bottom-0 w-1/3 h-2/3 bg-blue-800 opacity-20 rounded-tl-full"></div>
      </section>
      
      {/* Enhanced Testimonials Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-800">
            What Our Students Say
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Hear from some of our students who have transformed their language abilities with us
          </p>
          <Testimonials />
        </div>
      </section>
      
      {/* Enhanced Features/Courses Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-gray-800">
            Our Language Courses
          </h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Choose from our variety of language courses designed to help you achieve fluency,
            enhance your career, or simply explore a new culture
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-600 group hover:-translate-y-2"
              >
                <div className="w-16 h-16 mb-6 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
                  <OptimizedImage
                    src={feature.icon}
                    alt={feature.title}
                    width={40}
                    height={40}
                    className="object-contain"
                  />
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-800 group-hover:text-blue-700 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Language Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Contact us today to discuss your language learning goals and find the perfect course for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:bg-yellow-300 hover:text-blue-800 transition-all duration-300 shadow-lg"
              >
                Contact Us
              </Link>
              <Link
                href="/courses" 
                className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                View Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}