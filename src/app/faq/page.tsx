// src/app/faq/page.tsx

import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';


export const metadata: Metadata = {
  title: 'Frequently Asked Questions - Oslo Languages',
  description: 'Find answers to common questions about our language courses, teaching methods, and registration process at Oslo Languages.',
  keywords: ['oslo languages faq', 'language course questions', 'norwegian course faq', 'language school oslo faq'],
};

type FAQCategory = {
  title: string;
  questions: {
    question: string;
    answer: string | React.ReactNode;
  }[];
};

const faqData: FAQCategory[] = [
  {
    title: "Course Information",
    questions: [
      {
        question: "What levels do you offer?",
        answer: "We offer courses from complete beginner (A1) to advanced (C1) levels in Norwegian, English, and Spanish. Each level follows the Common European Framework of Reference for Languages (CEFR)."
      },
      {
        question: "How long are the courses?",
        answer: "Most of our courses run for 10 weeks with two 2-hour sessions per week. We also offer intensive courses and private tutoring with flexible schedules."
      },
      {
        question: "What is the maximum class size?",
        answer: "To ensure quality instruction and individual attention, we limit our classes to a maximum of 12 students."
      }
    ]
  },
  {
    title: "Registration & Payment",
    questions: [
      {
        question: "How do I register for a course?",
        answer: <>You can register through our <Link href="/contact" className="text-blue-600 hover:underline">contact form</Link> or visit our school in person. Once we receive your registration, we&apos;ll guide you through the enrollment process.</>
      },
      {
        question: "What payment methods do you accept?",
        answer: "We accept credit/debit cards, bank transfers, and Vipps. Payment plans are available for course fees over NOK 15,000."
      },
      {
        question: "What is your cancellation policy?",
        answer: "Full refunds are available up to 14 days before the course starts. Cancellations within 14 days of the start date are eligible for a 50% refund or course credit."
      }
    ]
  },
  {
    title: "Teaching Method",
    questions: [
      {
        question: "What teaching methodology do you use?",
        answer: "We use a communicative approach focusing on practical language skills. Our lessons combine speaking, listening, reading, and writing with an emphasis on real-world communication."
      },
      {
        question: "Are the teachers native speakers?",
        answer: "Yes, all our teachers are native speakers or have native-level proficiency. They are also certified language teachers with extensive teaching experience."
      },
      {
        question: "Do you provide learning materials?",
        answer: "Yes, all course materials are included in the course fee. Students receive textbooks, workbooks, and access to our online learning platform."
      }
    ]
  },
  {
    title: "Online Learning",
    questions: [
      {
        question: "Do you offer online courses?",
        answer: "Yes, we offer online versions of most of our courses. These follow the same curriculum as our in-person courses and include live video sessions with teachers."
      },
      {
        question: "What technology do I need for online courses?",
        answer: "You need a reliable internet connection, a computer or tablet with a webcam, and a quiet space for learning. We use Zoom for live sessions."
      },
      {
        question: "Can I switch between online and in-person classes?",
        answer: "Yes, subject to availability, students can switch between online and in-person formats with advance notice."
      }
    ]
  }
];

export default function FAQPage() {
  return (
    <PageContainer>
      <h1 className="text-4xl font-bold text-center mb-8">
        Frequently Asked Questions
      </h1>

      <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
        Find answers to common questions about our language courses. If you can&apos;t find
        what you&apos;re looking for, please <Link href="/contact" className="text-blue-600 hover:underline">contact us</Link>.
      </p>

      <div className="space-y-12">
        {faqData.map((category, categoryIndex) => (
          <div key={categoryIndex}>
            <h2 className="text-2xl font-semibold mb-6 text-blue-800">
              {category.title}
            </h2>
            <div className="space-y-6">
              {category.questions.map((item, itemIndex) => (
                <div 
                  key={itemIndex}
                  className="bg-white rounded-lg shadow-lg p-6"
                >
                  <h3 className="text-lg font-semibold mb-3">
                    {item.question}
                  </h3>
                  <div className="text-gray-600">
                    {item.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Quick Contact Section */}
      <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          Still have questions?
        </h2>
        <p className="text-gray-600 mb-6">
          Our team is here to help you find the perfect language course.
        </p>
        <div className="space-x-4">
          <Link 
            href="/contact"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block"
          >
            Contact Us
          </Link>
          <Link
            href="/courses"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors inline-block"
          >
            View Courses
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}