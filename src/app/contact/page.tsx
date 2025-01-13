// src/app/contact/page.tsx

import { generateMetadata, generateOrganizationSchema } from '@/lib/schema';
import ContactForm from '@/components/widgets/ContactForm';
import Script from 'next/script';
import Layout from '@/components/layout/Layout';

export const metadata = generateMetadata({
  title: 'Contact Us',
  description: 'Get in touch with Oslo Languages. We\'d love to hear from you and will respond as soon as possible. Reach out for course information, registration, or any questions.',
  keywords: [
    'contact oslo languages',
    'language school contact',
    'oslo language courses',
    'contact language school oslo',
    'language learning contact'
  ]
});

export default function ContactPage() {
  const organizationData = {
    name: 'Oslo Languages',
    address: {
      street: '123 Business Street',
      city: 'Oslo',
      postalCode: '0123',
      country: 'NO'
    },
    telephone: '(+47) XXX-XX-XXX',
    openingHours: [
      'Monday-Friday 09:00-18:00',
      'Saturday 10:00-16:00',
      'Sunday Closed'
    ]
  };

  const structuredData = generateOrganizationSchema(organizationData);

  return (
    <>
      <Script
        id="organization-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <Layout>
        <section className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text-primary">Contact Us</h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Get in touch with us. We&apos;d love to hear from you and will respond as soon as possible.
          </p>
        </section>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-text-primary">Address</h3>
                  <address className="text-text-secondary not-italic">
                    {organizationData.address.street}<br />
                    {organizationData.address.city}, {organizationData.address.postalCode}<br />
                    {organizationData.address.country}
                  </address>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Phone</h3>
                  <p className="text-text-secondary">
                    <a 
                      href={`tel:${organizationData.telephone.replace(/[^0-9+]/g, '')}`}
                      className="hover:text-accent-primary transition-colors"
                    >
                      {organizationData.telephone}
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-text-primary">Email</h3>
                  <p className="text-text-secondary">
                    <a 
                      href="mailto:info@oslolanguages.com"
                      className="hover:text-accent-primary transition-colors"
                    >
                      info@oslolanguages.com
                    </a>
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">Business Hours</h2>
              <div className="space-y-2">
                {organizationData.openingHours.map((hours, index) => (
                  <p key={index} className="text-text-secondary">
                    {hours}
                  </p>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 text-text-primary">Other Ways to Connect</h2>
              <div className="space-y-2">
                <p className="text-text-secondary">
                  Follow us on social media for updates, language learning tips, and cultural insights.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://facebook.com/oslolanguages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    Facebook
                  </a>
                  <a
                    href="https://instagram.com/oslolanguages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    Instagram
                  </a>
                  <a
                    href="https://linkedin.com/company/oslolanguages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-bg-secondary p-6 rounded-lg shadow-lg border border-text-secondary">
            <h2 className="text-2xl font-semibold mb-6 text-text-primary">Send us a Message</h2>
            <ContactForm />
          </div>
        </div>
      </Layout>
    </>
  );
}