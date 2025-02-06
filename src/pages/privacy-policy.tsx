// src/app/privacy-policy/page.tsx

import { generateMetadata } from '@/utils/schema';
import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';

export const metadata = generateMetadata({
  title: 'Privacy Policy - Oslo Languages',
  description: 'Read our privacy policy to understand how Oslo Languages collects, uses, and protects your personal information.',
});

export default function PrivacyPolicyPage() {
  return (
    <PageContainer narrowWidth>
      <article className="prose prose-lg max-w-3xl mx-auto text-text-primary">
        <h1>Privacy Policy</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Information We Collect</h2>
          <p>We collect information that you provide directly to us, including:</p>
          <ul>
            <li>Name and contact information</li>
            <li>Course registration details</li>
            <li>Payment information</li>
            <li>Communication preferences</li>
          </ul>
        </section>

        <section>
          <h2>2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul>
            <li>Process your course registrations</li>
            <li>Communicate with you about our services</li>
            <li>Improve our courses and services</li>
            <li>Send you marketing communications (with your consent)</li>
          </ul>
        </section>

        <section>
          <h2>3. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect
            your personal data against unauthorized access, alteration, disclosure,
            or destruction.
          </p>
        </section>

        <section>
          <h2>4. Your Rights</h2>
          <p>You have the right to:</p>
          <ul>
            <li>Access your personal data</li>
            <li>Correct inaccurate data</li>
            <li>Request deletion of your data</li>
            <li>Object to data processing</li>
            <li>Data portability</li>
          </ul>
        </section>

        <section>
          <h2>5. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our
            website and improve your experience. You can control cookies through your
            browser settings.
          </p>
        </section>

        <section>
          <h2>6. Contact Us</h2>
          <p>
            If you have questions about this Privacy Policy, please{' '}
            <Link href="/contact" className="text-accent-primary hover:underline">
              contact us
            </Link>
            .
          </p>
        </section>
      </article>
    </PageContainer>
  );
}