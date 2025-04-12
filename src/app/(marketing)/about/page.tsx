

import { generateMetadata } from '@/lib/seo/metadata';
import Container from '@/components/common/Container';
import HeroSection from './_HeroSection';
import HistorySection from './_HistorySection';
import MethodologySection from './_MethodologySection';
import TeachersSectionClient from './_TeachersSection';
import StatsSection from './_StatsSection';
import CTASection from './_CTASection';
import { post, teachers } from '@/data/about';

export const metadata = generateMetadata({
  title: 'About Us',
  description: 'Learn about Oslo Languages, our expert teachers, and our proven teaching methodology. Established in 2015, we are one of Oslo\'s leading language schools.',
  keywords: [
    'language school oslo',
    'norwegian teachers',
    'english teachers oslo', 
    'spanish teachers norway',
    'about oslo languages',
    'language teaching methodology'
  ],
  image: '/og/about.jpg'
});

export default function AboutPage() {
  return (
    <Container size="full" padding="none">
      <HeroSection 
        title="About Oslo Languages" 
        subtitle="Established in 2015..." 
      />
      <HistorySection coverImage={post.coverImage} />
      <MethodologySection />
      <TeachersSectionClient teachers={teachers} />
      <StatsSection />
      <CTASection />
    </Container>
  );
}