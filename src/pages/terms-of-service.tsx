// src/app/terms-of-service/page.tsx

import { generateMetadata } from '@/utils/schema';
import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';

export const metadata = generateMetadata({
  title: 'Terms of Service - Oslo Languages',
  description: 'Read our terms of service to understand the rules and regulations governing the use of Oslo Languages services.',
});

export default function TermsOfServicePage() {
  return (
    <PageContainer narrowWidth>
      <article className="prose prose-lg max-w-3xl mx-auto text-text-primary">
        <h1>Terms of Service</h1>
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <section>
          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing or using our services, you agree to be bound by these Terms
            of Service. If you disagree with any part of the terms, you do not have
            permission to access our services.
          </p>
        </section>

        <section>
          <h2>2. Course Registration and Payment</h2>
          <ul>
            <li>Course fees must be paid in full before the course start date</li>
            <li>Registration is confirmed only after payment is received</li>
            <li>Course materials are included in the course fee unless stated otherwise</li>
            <li>Prices are subject to change without notice</li>
          </ul>
        </section>

        <section>
          <h2>3. Cancellation Policy</h2>
          <ul>
            <li>Full refund available up to 14 days before course start</li>
            <li>50% refund available 7-14 days before course start</li>
            <li>No refund available less than 7 days before course start</li>
            <li>Course transfers may be available subject to availability</li>
          </ul>
        </section>

        <section>
          <h2>4. Class Attendance</h2>
          <ul>
            <li>Students are expected to attend all scheduled classes</li>
            <li>Missed classes cannot be refunded</li>
            <li>Make-up classes may be arranged subject to availability</li>
          </ul>
        </section>

        <section>
          <h2>5. Course Materials</h2>
          <p>
            All course materials provided are protected by copyright and may not be
            reproduced or distributed without permission.
          </p>
        </section>

        <section>
          <h2>6. Code of Conduct</h2>
          <p>
            Students are expected to behave respectfully towards teachers and fellow
            students. Any form of harassment or discrimination will not be tolerated.
          </p>
        </section>

        <section>
          <h2>7. Changes to Terms</h2>
          <p>
            We reserve the right to modify these terms at any time. We will notify
            students of any material changes via email.
          </p>
        </section>

        <section>
          <h2>8. Contact</h2>
          <p>
            If you have any questions about these Terms, please{' '}
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