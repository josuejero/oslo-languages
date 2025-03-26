// src/pages/terms-of-service.tsx
import React from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import { FileText, DollarSign, Calendar, Users, BookOpen, Shield, RefreshCw, HelpCircle } from 'lucide-react';

export default function TermsOfServicePage() {
  return (
    <PageContainer narrowWidth>
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-2xl mb-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Terms of <span className="text-yellow-300">Service</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">
            Please read these terms carefully before using our services.
          </p>
          <p className="mt-4 text-blue-200">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
        
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" 
             style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "20px 20px" }}>
        </div>
      </div>

      <div className="py-10 space-y-12">
        {/* 1. Agreement to Terms */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-blue-100 mr-4">
              <FileText className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="agreement-to-terms">
                1. Agreement to Terms
              </h2>
              <p className="text-lg text-gray-700">
                By accessing or using our services, you agree to be bound by these Terms
                of Service. If you disagree with any part of the terms, you do not have
                permission to access our services.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Course Registration and Payment */}
        <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-lg p-6 border border-green-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-green-100 mr-4">
              <DollarSign className="h-7 w-7 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="course-registration">
                2. Course Registration and Payment
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Course fees must be paid in full before the course start date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Registration is confirmed only after payment is received</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Course materials are included in the course fee unless stated otherwise</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2 text-xl">•</span>
                  <span>Prices are subject to change without notice</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Cancellation Policy */}
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-amber-100 mr-4">
              <Calendar className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="cancellation-policy">
                3. Cancellation Policy
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2 text-xl">•</span>
                  <span>Full refund available up to 14 days before course start</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2 text-xl">•</span>
                  <span>50% refund available 7-14 days before course start</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2 text-xl">•</span>
                  <span>No refund available less than 7 days before course start</span>
                </li>
                <li className="flex items-start">
                  <span className="text-amber-500 mr-2 text-xl">•</span>
                  <span>Course transfers may be available subject to availability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 4. Class Attendance */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-indigo-100 mr-4">
              <Users className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="class-attendance">
                4. Class Attendance
              </h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 text-xl">•</span>
                  <span>Students are expected to attend all scheduled classes</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 text-xl">•</span>
                  <span>Missed classes cannot be refunded</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2 text-xl">•</span>
                  <span>Make-up classes may be arranged subject to availability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Course Materials */}
        <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl shadow-lg p-6 border border-violet-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-violet-100 mr-4">
              <BookOpen className="h-7 w-7 text-violet-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="course-materials">
                5. Course Materials
              </h2>
              <p className="text-lg text-gray-700">
                All course materials provided are protected by copyright and may not be
                reproduced or distributed without permission.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Code of Conduct */}
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl shadow-lg p-6 border border-rose-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-rose-100 mr-4">
              <Shield className="h-7 w-7 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="code-of-conduct">
                6. Code of Conduct
              </h2>
              <p className="text-lg text-gray-700">
                Students are expected to behave respectfully towards teachers and fellow
                students. Any form of harassment or discrimination will not be tolerated.
              </p>
            </div>
          </div>
        </div>

        {/* 7. Changes to Terms */}
        <div className="bg-gradient-to-br from-cyan-50 to-white rounded-xl shadow-lg p-6 border border-cyan-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-cyan-100 mr-4">
              <RefreshCw className="h-7 w-7 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="changes-to-terms">
                7. Changes to Terms
              </h2>
              <p className="text-lg text-gray-700">
                We reserve the right to modify these terms at any time. We will notify
                students of any material changes via email.
              </p>
            </div>
          </div>
        </div>

        {/* 8. Contact */}
        <div className="bg-gradient-to-br from-teal-50 to-white rounded-xl shadow-lg p-6 border border-teal-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-teal-100 mr-4">
              <HelpCircle className="h-7 w-7 text-teal-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="contact">
                8. Contact
              </h2>
              <p className="text-lg text-gray-700">
                If you have any questions about these Terms, please{' '}
                <Link href="/contact" className="text-blue-600 hover:underline font-medium">
                  contact us
                </Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 border border-blue-200 text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have Questions About Our Terms?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            Our team is here to help you understand our policies and terms of service.
            Feel free to reach out if you need any clarification.
          </p>
          <Link 
            href="/contact"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}