import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/common/layout/Container";
import { features } from '@/data';
import AnimateOnScroll from '@/components/common/animation/AnimateOnScroll';


const Testimonials = dynamic(() => import('@/components/features/Testimonials'), {
  loading: () => <div className="h-80 bg-gray-100 animate-pulse rounded-lg"></div>,
  ssr: false
});

const NewsletterSignup = dynamic(() => import('@/components/features/NewsletterSignup'), {
  ssr: false
});

export default function Home() {
  return (
    <Container containerSize="full" padding="none">
      {}
      <section className="relative overflow-hidden py-20 md:py-28 w-full bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700">
        {}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 opacity-90"></div>
        
        {}
        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/10 rounded-full blur-xl animate-float"></div>
        <div className="absolute left-20 top-20 w-32 h-32 bg-yellow-200/10 rounded-full blur-xl animate-float-delay"></div>
        
        {}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", 
          backgroundSize: "20px 20px" 
        }}></div>
        
        <div className="container relative mx-auto px-6 z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white leading-tight animate-fadeIn">
              Learn Languages in the 
              <span className="block text-yellow-300 relative">
                Heart of Oslo
                <svg className="absolute -bottom-2 left-0 w-full h-2 text-yellow-300" viewBox="0 0 200 8" preserveAspectRatio="none">
                  <path d="M0,5 C50,0 150,0 200,5" fill="none" stroke="currentColor" strokeWidth="3"></path>
                </svg>
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 animate-fadeIn delay-200">
              Join Oslo&apos;s premier language school offering Norwegian, English, Spanish and more.
              Expert teachers, flexible schedules, and proven learning methods.
            </p>
            <div className="animate-fadeIn delay-300">
              <Link 
                href="/courses"
                className="group inline-block bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:bg-yellow-300 hover:text-blue-800 transform hover:-translate-y-1 transition-all duration-300"
              >
                Explore Our Courses
                <span className="inline-block ml-2 transform group-hover:translate-x-1 transition-transform">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white w-full">
        <div className="container mx-auto px-6">
          <AnimateOnScroll animation="animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-text-primary relative">
              <span className="relative inline-block">
                What Our Students Say
                <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-blue-500 rounded-full"></span>
              </span>
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="animate-fadeIn" delay={100}>
            <p className="text-center text-text-secondary mb-12 max-w-2xl mx-auto">
              Hear from some of our students who have transformed their language abilities with us
            </p>
          </AnimateOnScroll>
          <Testimonials />
        </div>
      </section>
      
      {}
      <section className="py-20 bg-background-primary">
        <div className="container mx-auto px-6">
          <AnimateOnScroll animation="animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-3 text-text-primary">
              Our Language Courses
            </h2>
          </AnimateOnScroll>
          <AnimateOnScroll animation="animate-fadeIn" delay={100}>
            <p className="text-center text-text-secondary mb-16 max-w-2xl mx-auto">
              Choose from our variety of language courses designed to help you achieve fluency,
              enhance your career, or simply explore a new culture
            </p>
          </AnimateOnScroll>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <AnimateOnScroll 
                key={index} 
                animation="animate-fadeInUp" 
                delay={(index + 1) * 100}
                className="h-full"
              >
                <div className="group bg-white p-8 rounded-xl shadow-lg hover:shadow-xl border-t-4 border-action-primary transition-all duration-300 hover:-translate-y-2 flex flex-col h-full">
                  <div className="w-16 h-16 mb-6 rounded-full bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all duration-300">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={40}
                      height={40}
                      className="object-contain group-hover:scale-110 transition-all duration-300"
                    />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-text-primary group-hover:text-action-primary transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-text-secondary group-hover:text-text-primary transition-all duration-300 mb-6">
                    {feature.description}
                  </p>
                  <div className="mt-auto">
                    <Link 
                      href={`/courses#${feature.title.toLowerCase().replace(' ', '-')}`}
                      className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-all duration-300"
                    >
                      Learn more
                      <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {}
      <AnimateOnScroll animation="animate-fadeIn">
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="max-w-2xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
        </section>
      </AnimateOnScroll>

      {}
      <section className="py-20 bg-gradient-to-r from-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-0 -left-10 w-40 h-40 bg-white rounded-full"></div>
          <div className="absolute bottom-0 right-0 w-60 h-60 bg-white rounded-full"></div>
          <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-white rounded-full"></div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <AnimateOnScroll animation="animate-fadeIn" className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Language Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-10">
              Contact us today to discuss your language learning goals and find the perfect course for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/contact"
                className="group relative overflow-hidden bg-white text-blue-700 px-8 py-4 rounded-lg font-semibold hover:text-blue-800 transition-all duration-300 shadow-lg"
              >
                <span className="relative z-10">Contact Us</span>
                <div className="absolute inset-0 bg-yellow-300 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              </Link>
              <Link
                href="/courses" 
                className="group relative bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all duration-300"
              >
                <span className="group-hover:mr-2 transition-all duration-300">View Courses</span>
                <span className="inline-block transform opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">→</span>
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </Container>
  );
}
