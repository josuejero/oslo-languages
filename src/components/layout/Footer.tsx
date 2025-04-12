
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="bg-gradient-to-r from-purple-900 via-indigo-900 to-gray-900 text-white mt-auto"
      aria-label="Site footer"
    >
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">
              About Oslo Languages
            </h3>
            <p className="leading-relaxed text-gray-200">
              Dedicated to providing quality language education in Oslo.
              We offer courses in Norwegian, English, Spanish, and more.
            </p>
          </div>

          {}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">
              Quick Links
            </h3>
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

          {}
          <div>
            <h3 className="text-sm font-semibold tracking-wide uppercase mb-4">
              Contact Info
            </h3>
            <ul className="space-y-2 text-gray-200">
              <li>Email: contact@oslolanguages.no</li>
              <li>Phone: (47) XXX XX XXX</li>
              <li>Address: Oslo, Norway</li>
            </ul>
          </div>
        </div>

        {}
        <div className="border-t border-white/20 mt-8 py-4">
          <p className="text-center text-sm text-gray-300">
            &copy; {currentYear} Oslo Languages. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}