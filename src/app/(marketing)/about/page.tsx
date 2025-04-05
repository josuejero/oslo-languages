// src/app/(marketing)/about/page.tsx
// No "use client" here, so it's purely a Server Component

import { generateMetadata } from '@/lib/seo/metadata';
import Layout from '@/components/common/layout/Container';
import HeroSection from './_HeroSection';
import HistorySection from './_HistorySection';
import MethodologySection from './_MethodologySection';
import TeachersSectionClient from './_TeachersSection'; // << new client component
import StatsSection from './_StatsSection';
import CTASection from './_CTASection';
import { post, teachers } from '@/data/about';

// (Optional) For Next.js app router SEO
export const metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about Oslo Languages...',
  keywords: ['language school oslo', 'about oslo languages'],
  image: '/og/about.jpg',
});

export default function AboutPage() {
  return (
    <Layout>
      <HeroSection
        title="About Oslo Languages"
        subtitle="Established in 2015..."
      />
      <HistorySection coverImage={post.coverImage} />
      <MethodologySection />

      {/* 
        Instead of passing activeTeacher and setActiveTeacher from the parent,
        we delegate that state logic to a new client component:
      */}
      <TeachersSectionClient teachers={teachers} />

      <StatsSection />
      <CTASection />
    </Layout>
  );
}
