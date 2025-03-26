// src/pages/privacy-policy.tsx
import React from 'react';
import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';
import { Shield, FileText, Lock, User, Cookie, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <PageContainer narrowWidth>
      {/* Hero Section */}
      <div className="relative py-16 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white rounded-2xl mb-10 overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-4xl font-bold mb-4">
            Privacy <span className="text-yellow-300">Policy</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-100">
            We care about your privacy and are committed to protecting your personal information.
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
        {/* 1. Information We Collect */}
        <div className="bg-gradient-to-br from-blue-50 to-white rounded-xl shadow-lg p-6 border border-blue-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-blue-100 mr-4">
              <FileText className="h-7 w-7 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="information-we-collect">
                1. Information We Collect
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Name and contact information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Course registration details</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Payment information</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>Communication preferences</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 2. How We Use Your Information */}
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-6 border border-indigo-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-indigo-100 mr-4">
              <Shield className="h-7 w-7 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="how-we-use">
                2. How We Use Your Information
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Process your course registrations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Communicate with you about our services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Improve our courses and services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-500 mr-2">•</span>
                  <span>Send you marketing communications (with your consent)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. Data Security */}
        <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl shadow-lg p-6 border border-emerald-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-emerald-100 mr-4">
              <Lock className="h-7 w-7 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="data-security">
                3. Data Security
              </h2>
              <p className="text-lg text-gray-700">
                We implement appropriate technical and organizational measures to protect
                your personal data against unauthorized access, alteration, disclosure,
                or destruction.
              </p>
            </div>
          </div>
        </div>

        {/* 4. Your Rights */}
        <div className="bg-gradient-to-br from-violet-50 to-white rounded-xl shadow-lg p-6 border border-violet-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-violet-100 mr-4">
              <User className="h-7 w-7 text-violet-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="your-rights">
                4. Your Rights
              </h2>
              <p className="text-lg text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Access your personal data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Correct inaccurate data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Request deletion of your data</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Object to data processing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-violet-500 mr-2">•</span>
                  <span>Data portability</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 5. Cookies */}
        <div className="bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-lg p-6 border border-amber-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-amber-100 mr-4">
              <Cookie className="h-7 w-7 text-amber-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="cookies">
                5. Cookies
              </h2>
              <p className="text-lg text-gray-700">
                We use cookies and similar tracking technologies to track activity on our
                website and improve your experience. You can control cookies through your
                browser settings.
              </p>
            </div>
          </div>
        </div>

        {/* 6. Contact Us */}
        <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl shadow-lg p-6 border border-rose-100 hover:shadow-xl transition-all">
          <div className="flex items-start">
            <div className="p-3 rounded-xl bg-rose-100 mr-4">
              <Mail className="h-7 w-7 text-rose-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4" id="contact-us">
                6. Contact Us
              </h2>
              <p className="text-lg text-gray-700">
                If you have questions about this Privacy Policy, please{' '}
                <Link href="/contact" className="text-blue-600 font-medium hover:underline">
                  contact us
                </Link>.
              </p>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-lg p-8 border border-blue-200 text-center mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Have More Questions?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            We&apos;re committed to protecting your privacy. If you have any questions about our Privacy Policy, 
            our team is here to help.
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