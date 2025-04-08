// src/app/(marketing)/privacy-policy/page.tsx
import { Metadata } from "next";
import Link from "next/link";
import { Shield, Info, Database, Cookie, Mail, ArrowRight } from "lucide-react";
import AnimateOnScroll from "@/components/common/animation/AnimateOnScroll";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Oslo Languages",
  description: "Our commitment to protecting your privacy and personal information.",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-10"></div>
        
        {/* Decorative pattern */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }}
        ></div>
        
        <div className="container relative mx-auto px-6 z-10">
          <AnimateOnScroll animation="animate-fadeIn">
            <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <div className="w-24 h-1 bg-blue-500 mx-auto mb-6 rounded-full"></div>
            <p className="text-xl text-center text-gray-600 max-w-3xl mx-auto">
              Our commitment to protecting your privacy and safeguarding your personal information
            </p>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-8 md:py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12">
            {/* Policy Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center">
                <Shield className="w-8 h-8 mr-4" />
                <h2 className="text-2xl font-bold">Our Privacy Commitment</h2>
              </div>
              <p className="mt-2 opacity-90 pl-12">
                Last updated: April 2025
              </p>
            </div>
            
            {/* Policy Content */}
            <div className="p-8">
              <div className="space-y-8">
                {/* Section 1 */}
                <AnimateOnScroll animation="animate-fadeIn" delay={100}>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <Info className="w-6 h-6 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">1. Introduction</h3>
                      <div className="pl-4 border-l-2 border-blue-200">
                        <p className="text-gray-700 leading-relaxed">
                          Oslo Languages (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                          This Privacy Policy explains how we collect, use, and safeguard your information 
                          when you visit our website or use our services.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Section 2 */}
                <AnimateOnScroll animation="animate-fadeIn" delay={200}>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <Database className="w-6 h-6 text-indigo-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">2. Information We Collect</h3>
                      <div className="pl-4 border-l-2 border-indigo-200">
                        <p className="text-gray-700 leading-relaxed">
                          We collect information you provide directly to us, such as when you fill out 
                          our contact form, register for courses, or subscribe to our newsletter. This 
                          may include your name, email address, phone number, and any other information 
                          you choose to provide.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Section 3 */}
                <AnimateOnScroll animation="animate-fadeIn" delay={300}>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">3. How We Use Your Information</h3>
                      <div className="pl-4 border-l-2 border-purple-200">
                        <p className="text-gray-700 leading-relaxed">
                          We use the information we collect to provide, maintain, and improve our services, 
                          to communicate with you about courses and events, and to respond to your inquiries.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Section 4 */}
                <AnimateOnScroll animation="animate-fadeIn" delay={400}>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                        <Cookie className="w-6 h-6 text-amber-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">4. Cookies and Tracking Technologies</h3>
                      <div className="pl-4 border-l-2 border-amber-200">
                        <p className="text-gray-700 leading-relaxed">
                          Our website may use cookies and similar tracking technologies to enhance your experience
                          and collect information about how you use our site.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>

                {/* Section 5 */}
                <AnimateOnScroll animation="animate-fadeIn" delay={500}>
                  <div className="flex gap-5">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold mb-4 text-gray-800">5. Contact Us</h3>
                      <div className="pl-4 border-l-2 border-green-200">
                        <p className="text-gray-700 leading-relaxed">
                          If you have any questions about this Privacy Policy, please contact us at{' '}
                          <a 
                            href={`mailto:${siteConfig.contact.email}`}
                            className="text-blue-600 hover:text-blue-800 underline"
                          >
                            {siteConfig.contact.email}
                          </a>.
                        </p>
                      </div>
                    </div>
                  </div>
                </AnimateOnScroll>
              </div>
            </div>
          </div>

          {/* Interactive Card */}
          <AnimateOnScroll animation="animate-fadeIn" delay={600}>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 shadow-md border border-blue-100 hover:shadow-lg transition-all duration-300">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Have Questions About Your Data?</h3>
                <p className="text-gray-600 mt-2">
                  We're committed to transparency. If you have any questions about your data or our privacy practices, we're here to help.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
                <Link href="/contact" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow flex items-center justify-center">
                  Contact Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
                <Link href="/legal" className="border border-blue-300 text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center justify-center">
                  View All Legal Information
                </Link>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}