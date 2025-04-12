
import { Metadata } from 'next';
import Image from 'next/image';
import ContactForm from '@/components/features/contact/ContactForm';
import AnimateOnScroll from '@/components/common/animation/AnimateOnScroll';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Contact Us | Oslo Languages',
  description: 'Get in touch with Oslo Languages to inquire about our courses or ask any questions.',
};

export default function ContactPage() {
  return (
    <section className="min-h-screen py-16 bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="container mx-auto px-4 mb-12">
        <AnimateOnScroll animation="animate-fadeIn">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-text-primary">
              Contact <span className="text-blue-600">Us</span>
            </h1>
            <p className="text-lg text-text-secondary mb-6">
              Have questions about our language courses? We&apos;re here to help you on your language learning journey.
            </p>
          </div>
        </AnimateOnScroll>
      </div>

      {}
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 items-start">
          {}
          <div className="md:col-span-3">
            <AnimateOnScroll animation="animate-fadeIn" delay={100}>
              <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-8">
                  <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>
                  <p className="text-blue-100">Fill out the form below and we&apos;ll get back to you shortly</p>
                </div>
                <div className="p-8">
                  <ContactForm />
                </div>
              </div>
            </AnimateOnScroll>
          </div>

          {}
          <div className="md:col-span-2 space-y-6">
            {}
            <AnimateOnScroll animation="animate-fadeIn" delay={200}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-blue-500">
                <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
                  <span className="bg-blue-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  Visit Us
                </h3>
                <div className="pl-10 space-y-2 text-text-secondary">
                  <p>{siteConfig.contact.address}</p>
                  <p>0159 Oslo, Norway</p>
                  <p className="font-medium">Monday - Friday: 9:00 - 18:00</p>
                </div>
                
                {}
                <div className="mt-4 relative h-40 rounded-lg overflow-hidden">
                  <Image 
                    src="/images/default-image.jpg" 
                    alt="Map showing Oslo Languages location"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
              </div>
            </AnimateOnScroll>
            
            {}
            <AnimateOnScroll animation="animate-fadeIn" delay={300}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-indigo-500">
                <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
                  <span className="bg-indigo-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  Contact Information
                </h3>
                <div className="pl-10 space-y-4">
                  <p className="flex items-center text-text-secondary">
                    <span className="text-text-primary font-medium mr-2">Email:</span>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-action-primary hover:text-action-primaryHover transition-colors">
                      {siteConfig.contact.email}
                    </a>
                  </p>
                  <p className="flex items-center text-text-secondary">
                    <span className="text-text-primary font-medium mr-2">Phone:</span>
                    <a href={`tel:${siteConfig.contact.phone}`} className="text-action-primary hover:text-action-primaryHover transition-colors">
                      {siteConfig.contact.phone}
                    </a>
                  </p>
                </div>
              </div>
            </AnimateOnScroll>
            
            {}
            <AnimateOnScroll animation="animate-fadeIn" delay={400}>
              <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-t-4 border-purple-500">
                <h3 className="text-xl font-semibold mb-4 text-text-primary flex items-center">
                  <span className="bg-purple-100 p-2 rounded-full mr-3">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </span>
                  Connect With Us
                </h3>
                <div className="pl-10 flex space-x-4 mt-4">
                  <a href={siteConfig.links.facebook} className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors">
                    <span className="sr-only">Facebook</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                  <a href={siteConfig.links.instagram} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-colors">
                    <span className="sr-only">Instagram</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a href="#" className="bg-sky-500 text-white p-3 rounded-full hover:bg-sky-600 transition-colors">
                    <span className="sr-only">Twitter</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                </div>
              </div>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
      
      {}
      <div className="container mx-auto px-4 mt-16">
        <AnimateOnScroll animation="animate-fadeIn" delay={500}>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-text-primary">Frequently Asked Questions</h2>
            <p className="text-text-secondary mt-2">Find quick answers to common questions</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">How do I register for a course?</h3>
              <p className="text-gray-600">Fill out our contact form with your preferred course, and one of our advisors will guide you through the registration process.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">What levels do you offer?</h3>
              <p className="text-gray-600">We offer courses from beginner (A1) to advanced (C2) levels in Norwegian, English, and Spanish.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">Do you offer online courses?</h3>
              <p className="text-gray-600">Yes, we offer both in-person and online courses to accommodate different learning preferences.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-all">
              <h3 className="text-lg font-semibold mb-2 text-blue-700">How long are the courses?</h3>
              <p className="text-gray-600">Courses typically run for 10-12 weeks, with 2-3 sessions per week depending on the intensity level you choose.</p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}