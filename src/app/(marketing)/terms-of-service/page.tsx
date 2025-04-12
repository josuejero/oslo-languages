
import { Metadata } from "next";
import Link from "next/link";
import { FileText, Shield, Scale, AlertCircle, RefreshCw } from "lucide-react";
import AnimateOnScroll from "@/components/common/animation/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Terms of Service | Oslo Languages",
  description: "Terms and conditions for using Oslo Languages services and website.",
};

export default function TermsOfService() {
  return (
    <section className="min-h-screen py-16 bg-gradient-to-b from-blue-50 to-white">
      {}
      <div className="container mx-auto px-4 max-w-5xl">
        <AnimateOnScroll animation="animate-fadeIn">
          <h1 className="text-4xl md:text-5xl font-bold text-center text-gray-900 mb-4">
            Terms of Service
          </h1>
          <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>
          <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
            Please read these terms carefully before using our services
          </p>
        </AnimateOnScroll>
        
        {}
        <div className="space-y-6 mb-12">
          {}
          <AnimateOnScroll animation="animate-fadeIn" delay={100}>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-full -translate-x-10 -translate-y-20 opacity-50"></div>
              <div className="relative z-10 flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="bg-blue-100 p-4 rounded-full">
                    <FileText className="w-8 h-8 text-blue-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing or using our website, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {}
          <AnimateOnScroll animation="animate-fadeIn" delay={200}>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-indigo-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-full -translate-x-10 -translate-y-20 opacity-50"></div>
              <div className="relative z-10 flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="bg-indigo-100 p-4 rounded-full">
                    <Scale className="w-8 h-8 text-indigo-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">2. Course Registration and Payment</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Course registrations are confirmed upon receipt of payment. Payment methods and refund policies are specified during the registration process. All fees are non-refundable unless stated otherwise in our cancellation policy.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {}
          <AnimateOnScroll animation="animate-fadeIn" delay={300}>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 rounded-full -translate-x-10 -translate-y-20 opacity-50"></div>
              <div className="relative z-10 flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="bg-purple-100 p-4 rounded-full">
                    <Shield className="w-8 h-8 text-purple-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">3. Intellectual Property</h2>
                  <p className="text-gray-700 leading-relaxed">
                    The content, organization, graphics, design, and other matters related to the Site are protected under applicable copyrights and other proprietary laws. Copying, redistribution, use or publication of any such Content is strictly prohibited.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {}
          <AnimateOnScroll animation="animate-fadeIn" delay={400}>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-amber-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-amber-50 rounded-full -translate-x-10 -translate-y-20 opacity-50"></div>
              <div className="relative z-10 flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="bg-amber-100 p-4 rounded-full">
                    <AlertCircle className="w-8 h-8 text-amber-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">4. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We shall not be liable for any damages whatsoever arising out of or in connection with the use or inability to use our services or website. This includes, without limitation, direct, indirect, consequential, special, and exemplary damages.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>

          {}
          <AnimateOnScroll animation="animate-fadeIn" delay={500}>
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-green-50 rounded-full -translate-x-10 -translate-y-20 opacity-50"></div>
              <div className="relative z-10 flex">
                <div className="mr-6 flex-shrink-0">
                  <div className="bg-green-100 p-4 rounded-full">
                    <RefreshCw className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-4 text-gray-800">5. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms at any time. Your continued use of the site following any changes indicates your acceptance of the new terms. It is your responsibility to check this page periodically for changes.
                  </p>
                </div>
              </div>
            </div>
          </AnimateOnScroll>
        </div>
        
        {}
        <AnimateOnScroll animation="animate-fadeIn" delay={600}>
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-8 text-white shadow-xl">
            <div className="text-center max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Have Questions About Our Terms?</h3>
              <p className="mb-6 text-blue-100">
                If you have any questions or concerns about our Terms of Service, we&apos;re here to help. Please don&apos;t hesitate to contact our team.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/contact"
                  className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  href="/legal"
                  className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
                >
                  View All Legal Information
                </Link>
              </div>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}