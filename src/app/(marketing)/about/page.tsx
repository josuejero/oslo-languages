// src/app/(marketing)/about/page.tsx
// No "use client" here, so it's purely a Server Component

import { generateMetadata } from '@/lib/seo/metadata';
import Container from '@/components/common/Container'; // Fixed import name
import HeroSection from './_HeroSection';
import HistorySection from './_HistorySection';
import MethodologySection from './_MethodologySection';
import TeachersSectionClient from './_TeachersSection'; 
import StatsSection from './_StatsSection';
import CTASection from './_CTASection';
import { post, teachers } from '@/data/about';

// For Next.js app router SEO
export const metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about Oslo Languages...',
  keywords: ['language school oslo', 'about oslo languages'],
  image: '/og/about.jpg',
});

export default function AboutPage() {
  return (
    <Container size="full" padding="none"> {/* Changed from Layout to Container with explicit props */}
      <HeroSection
        title="About Oslo Languages"
        subtitle="Established in 2015..."
      />
      <HistorySection coverImage={post.coverImage} />
      <MethodologySection />

      {/* Client component with state managed internally */}
      <TeachersSectionClient teachers={teachers} />

      <StatsSection />
      <CTASection />
    </Container>
  );
}