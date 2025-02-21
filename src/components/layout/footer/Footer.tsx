/**
 * @file Footer.tsx
 * @description Provides a global site footer with brief “About” details, 
 * quick links, and contact info for Oslo Languages. 
 * Also includes copyright.
 */

import Link from 'next/link';

/**
 * @function Footer
 * Renders a site-wide footer section featuring general information and navigation.
 * 
 * @returns JSX.Element
 */
export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    // The "bg-secondary" class is assumed to be configured in Tailwind (or a custom config)
    <footer className="bg-secondary mt-auto" aria-label="Site footer">
      <div className="container-section">
        {/** 
         * Footer Widgets Section:
         * Divided into three columns: about info, quick links, and contact details.
         */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {/** About Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              About Oslo Languages
            </h3>
            <p className="text-secondary">
              Dedicated to providing quality language education in Oslo.
              We offer courses in Norwegian, English, Spanish, and more.
            </p>
          </div>

          {/** Quick Links Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="text-secondary hover:text-accent-primary"
                >
                  Our Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-secondary hover:text-accent-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-secondary hover:text-accent-primary"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-secondary hover:text-accent-primary"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/** Contact Info Column */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-primary">
              Contact Info
            </h3>
            <ul className="space-y-2 text-secondary">
              <li>Email: contact@oslolanguages.no</li>
              <li>Phone: (47) XXX XX XXX</li>
              <li>Address: Oslo, Norway</li>
            </ul>
          </div>
        </div>

        {/**
         * Footer Copyright:
         * A small bar with a border, plus current year.
         */}
        <div className="border-t border-secondary py-4">
          <div className="text-center text-secondary">
            <p>&copy; {currentYear} Oslo Languages. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
