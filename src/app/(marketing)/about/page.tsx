// pages/about/index.tsx
import { useState } from 'react';

// Example library function for SEO metadata (optional)
import { generateMetadata } from '@/lib/seo/metadata';

// Example layout component
import Layout from '@/components/common/layout/Container';

// Example data imports (post, teachers)
import { post, teachers } from '@/data/about';

// Underscored section components
import HeroSection from './_HeroSection';
import HistorySection from './_HistorySection';
import MethodologySection from './_MethodologySection';
import TeachersSection from './_TeachersSection';
import StatsSection from './_StatsSection'
import CTASection from './_CTASection';

// (Optional) If you're using Next.js app router SEO
export const metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about Oslo Languages, our expert teachers, and our proven teaching methodology.',
  keywords: ['language school oslo', 'about oslo languages'],
  image: '/og/about.jpg',
});

export default function AboutPage() {
  // Local state for teacher card hover
  const [activeTeacher, setActiveTeacher] = useState<number | null>(null);

  return (
    <Layout>
      <HeroSection
        title="About Oslo Languages"
        subtitle="Established in 2015, we are one of Oslo's leading language schools."
      />

      <HistorySection coverImage={post.coverImage} />

      <MethodologySection />

      <TeachersSection
        teachers={teachers}
        activeTeacher={activeTeacher}
        setActiveTeacher={setActiveTeacher}
      />

      <StatsSection />

      <CTASection />
    </Layout>
  );
}
