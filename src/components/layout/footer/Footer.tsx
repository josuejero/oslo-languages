/**
 * @file Footer.tsx
 * @description Provides a global site footer with brief “About” details, 
 * quick links, and contact info for Oslo Languages.
 * Also includes copyright.
 */

import Link from 'next/link';

/**
 * @function Footer
 * Renders a site-wide footer section featuring general information and navigation,
 * with a visually appealing gradient background and refined typography.
 * 
 * @returns JSX.Element
 */
export default function Footer(): JSX.Element {
  const currentYear = new Date().getFullYear();

  return (
    /**
     * Switched to a gradient background using Tailwind:
     * "bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900"
     * plus white text for contrast. 
     * Keeping "mt-auto" ensures the footer stays at the bottom.
     */
    <footer
      className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white mt-auto"
      aria-label="Site footer"
    >
      {/**
       * Using "max-w-7xl mx-auto px-6 py-12" to center content, 
       * add horizontal padding, and create vertical spacing.
       */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/**
         * Three-column layout: about info, quick links, and contact details.
         * "gap-8" ensures appropriate spacing between columns.
         */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/** About Column */}
          <div>
            {/**
             * Headings made uppercase, font-semibold, text-sm tracking-wide, etc.
             * "mb-4" for spacing below the heading.
             */}
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">
              About Oslo Languages
            </h3>
            <p className="leading-relaxed text-gray-200">
              Dedicated to providing quality language education in Oslo.
              We offer courses in Norwegian, English, Spanish, and more.
            </p>
          </div>

          {/** Quick Links Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">
              Quick Links
            </h3>
            {/**
             * "space-y-2" for vertical spacing between list items.
             * For each link: "hover:underline" and transition for a subtle effect.
             */}
            <ul className="space-y-2">
              <li>
                <Link
                  href="/courses"
                  className="hover:underline transition-colors duration-300"
                >
                  Our Courses
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:underline transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="hover:underline transition-colors duration-300"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:underline transition-colors duration-300"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/** Contact Info Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">
              Contact Info
            </h3>
            {/**
             * "space-y-2" for spacing between contact info lines.
             * Using text-gray-200 for a softer appearance on the gradient.
             */}
            <ul className="space-y-2 text-gray-200">
              <li>Email: contact@oslolanguages.no</li>
              <li>Phone: (47) XXX XX XXX</li>
              <li>Address: Oslo, Norway</li>
            </ul>
          </div>
        </div>

        {/**
         * Border using "border-t border-white/20" for subtle separation.
         * "mt-8 py-4" adds space above and below the border.
         */}
        <div className="border-t border-white/20 mt-8 py-4">
          <p className="text-center text-sm text-gray-300">
            &copy; {currentYear} Oslo Languages. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
