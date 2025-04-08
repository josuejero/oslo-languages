// src/app/(marketing)/legal/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, File, Book } from "lucide-react";
import AnimateOnScroll from "@/components/common/animation/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Legal Information | Oslo Languages",
  description: "Privacy policy and terms of service for Oslo Languages website and courses.",
};

export default function Legal() {
  return (
    <section className="py-16 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container mx-auto px-4 max-w-5xl">
        <AnimateOnScroll animation="animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 text-center text-gray-900">
            Legal Information
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Our commitment to transparency and protecting your rights while using our services
          </p>
        </AnimateOnScroll>
        
        {/* Privacy Policy Section */}
        <AnimateOnScroll animation="animate-fadeIn" delay={100}>
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl mb-10 hover:shadow-2xl transition-all duration-300 border-t-4 border-blue-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="bg-blue-100 p-3 rounded-full mr-4">
                  <Shield className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Privacy Policy</h2>
              </div>
              
              <div className="space-y-8">
                <div className="pl-4 border-l-4 border-blue-200 hover:border-blue-500 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Introduction</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Oslo Languages (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                    This Privacy Policy explains how we collect, use, and safeguard your information 
                    when you visit our website or use our services.
                  </p>
                </div>
                
                <div className="pl-4 border-l-4 border-blue-200 hover:border-blue-500 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">2. Information We Collect</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We collect information you provide directly to us, such as when you fill out 
                    our contact form, register for courses, or subscribe to our newsletter. This 
                    may include your name, email address, phone number, and any other information 
                    you choose to provide.
                  </p>
                </div>
                
                <div className="pl-4 border-l-4 border-blue-200 hover:border-blue-500 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">3. How We Use Your Information</h3>
                  <p className="text-gray-700 leading-relaxed">
                    We use the information we collect to provide, maintain, and improve our services, 
                    to communicate with you about courses and events, and to respond to your inquiries.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-right">
                <Link 
                  href="/privacy-policy" 
                  className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  Read full Privacy Policy
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
        
        {/* Terms of Service Section */}
        <AnimateOnScroll animation="animate-fadeIn" delay={200}>
          <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl mb-10 hover:shadow-2xl transition-all duration-300 border-t-4 border-indigo-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
            <div className="relative z-10">
              <div className="flex items-center mb-6">
                <div className="bg-indigo-100 p-3 rounded-full mr-4">
                  <File className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800">Terms of Service</h2>
              </div>
              
              <div className="space-y-8">
                <div className="pl-4 border-l-4 border-indigo-200 hover:border-indigo-500 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">1. Acceptance of Terms</h3>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using our website, you agree to be bound by these Terms of Service 
                    and all applicable laws and regulations. If you do not agree with any of these terms, 
                    you are prohibited from using or accessing this site.
                  </p>
                </div>
                
                <div className="pl-4 border-l-4 border-indigo-200 hover:border-indigo-500 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">2. Course Registration and Payment</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Course registrations are confirmed upon receipt of payment. Payment methods 
                    and refund policies are specified during the registration process.
                  </p>
                </div>
                
                <div className="pl-4 border-l-4 border-indigo-200 hover:border-indigo-500 transition-colors duration-300">
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">3. Intellectual Property</h3>
                  <p className="text-gray-700 leading-relaxed">
                    The content, organization, graphics, design, and other matters related to the 
                    Site are protected under applicable copyrights and other proprietary laws. 
                    Copying, redistribution, use or publication of any such Content is strictly prohibited.
                  </p>
                </div>
              </div>
              
              <div className="mt-8 text-right">
                <Link 
                  href="/terms-of-service" 
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read full Terms of Service
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
        
    
        {/* Contact Section */}
        <AnimateOnScroll animation="animate-fadeIn" delay={400}>
          <div className="text-center mt-12">
            <p className="text-gray-700 mb-4">
              If you have any questions about our legal policies, please don't hesitate to contact us.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
            >
              Contact Us
              <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}