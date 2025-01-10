// src/components/layout/footer/Footer.tsx

import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-bg-secondary mt-auto">
      <div className="container mx-auto px-4">
        {/* Footer Widgets Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">About Oslo Languages</h3>
            <p className="text-text-secondary">
              Dedicated to providing quality language education in Oslo. We offer courses in Norwegian, English, Spanish, and more.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/courses" className="text-text-secondary hover:text-accent-primary">
                  Our Courses
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-text-secondary hover:text-accent-primary">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="text-text-secondary hover:text-accent-primary">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-text-secondary hover:text-accent-primary">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4 text-text-primary">Contact Info</h3>
            <ul className="space-y-2 text-text-secondary">
              <li>Email: contact@oslolanguages.no</li>
              <li>Phone: (47) XXX XX XXX</li>
              <li>Address: Oslo, Norway</li>
            </ul>
          </div>
        </div>
        
        {/* Copyright Bar */}
        <div className="border-t border-text-secondary py-4">
          <div className="text-center text-text-secondary">
            <p>&copy; {currentYear} Oslo Languages. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
