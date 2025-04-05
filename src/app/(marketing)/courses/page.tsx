// src/app/(marketing)/courses/page.tsx
import { generateMetadata } from '@/lib/seo/metadata';
import Layout from '@/components/common/layout/Container';

// Import each underscored section component
import HeroSection from './_HeroSection';
import CourseListingsSection from './_CourseListingsSection';
import MiddleCTASection from './_MiddleCTASection';
import WhyChooseUsSection from './_WhyChooseUsSection';
import FinalCTASection from './_FinalCTASection';

// Set up SEO metadata (optional)
export const metadata = generateMetadata({
  title: 'Language Courses',
  description:
    'Explore our Norwegian, English, and Spanish language courses in Oslo. From beginner to advanced levels, find the perfect course for your language learning journey.',
  keywords: [
    'language courses oslo',
    'norwegian classes',
    'english courses norway',
    'spanish lessons oslo',
    'language learning',
    'oslo language school'
  ]
});

export default function CoursesPage() {
  return (
    <Layout>
      <HeroSection />

      <CourseListingsSection />

      <MiddleCTASection />

      <WhyChooseUsSection />

      <FinalCTASection />
    </Layout>
  );
}
