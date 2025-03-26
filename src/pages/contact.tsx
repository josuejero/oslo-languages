// src/pages/contact.tsx
import { generateMetadata } from '@/utils/schema';
import ContactForm from '@/components/widgets/ContactForm';
import Layout from '@/components/layout/Layout';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import Script from 'next/script';

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
  // Organization data for schema markup and contact details
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

  return (
    <Layout>
      {/* Animated Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 text-white py-24">
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", 
          backgroundSize: "20px 20px" 
        }}></div>
        
        {/* Animated floating circles */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-400 rounded-full opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-indigo-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <h1 className="text-5xl font-bold mb-6 animate-fadeIn">
            Contact <span className="text-yellow-300">Us</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto text-blue-100 animate-fadeIn" style={{ animationDelay: "0.3s" }}>
            Get in touch with us. We'd love to hear from you and will respond as soon as possible.
          </p>
        </div>
        
        {/* Wave divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" fill="#ffffff">
            <path d="M0,96L80,80C160,64,320,32,480,32C640,32,800,64,960,80C1120,96,1280,96,1360,96L1440,96L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Contact Information Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact Information Card */}
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-blue-100">
                <h2 className="text-3xl font-bold text-blue-800 mb-6 flex items-center">
                  <span className="bg-blue-100 p-2 rounded-full mr-3">
                    <MapPin className="w-6 h-6 text-blue-700" />
                  </span>
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  {/* Address */}
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Address</h3>
                      <address className="text-gray-600 not-italic mt-1">
                        {organizationData.address.street}<br />
                        {organizationData.address.city}, {organizationData.address.postalCode}<br />
                        {organizationData.address.country}
                      </address>
                    </div>
                  </div>
                  
                  {/* Phone */}
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Phone</h3>
                      <p className="text-gray-600 mt-1">
                        <a 
                          href={`tel:${organizationData.telephone.replace(/[^0-9+]/g, '')}`}
                          className="hover:text-blue-600 transition-colors"
                        >
                          {organizationData.telephone}
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  {/* Email */}
                  <div className="flex">
                    <div className="flex-shrink-0 mt-1">
                      <Mail className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600 mt-1">
                        <a 
                          href="mailto:info@oslolanguages.com"
                          className="hover:text-blue-600 transition-colors"
                        >
                          info@oslolanguages.com
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Business Hours Card */}
              <div className="bg-gradient-to-br from-white to-indigo-50 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-indigo-100">
                <h2 className="text-3xl font-bold text-indigo-800 mb-6 flex items-center">
                  <span className="bg-indigo-100 p-2 rounded-full mr-3">
                    <Clock className="w-6 h-6 text-indigo-700" />
                  </span>
                  Business Hours
                </h2>
                
                <div className="space-y-3">
                  {organizationData.openingHours.map((hours, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-indigo-100 last:border-0">
                      <div className="font-medium text-gray-700">{hours.split(' ')[0]}</div>
                      <div className="text-indigo-700 font-semibold">{hours.split(' ')[1] || 'Closed'}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Connect Card */}
              <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-xl p-8 transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border border-purple-100">
                <h2 className="text-3xl font-bold text-purple-800 mb-6 flex items-center">
                  <span className="bg-purple-100 p-2 rounded-full mr-3">
                    <ExternalLink className="w-6 h-6 text-purple-700" />
                  </span>
                  Connect With Us
                </h2>
                
                <p className="text-gray-600 mb-6">
                  Follow us on social media for updates, language learning tips, and cultural insights.
                </p>
                
                <div className="flex space-x-4">
                  <a
                    href="https://facebook.com/oslolanguages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label="Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                    </svg>
                  </a>
                  
                  <a
                    href="https://instagram.com/oslolanguages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-100 text-pink-700 hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label="Instagram"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.218-1.79.465-2.428.254-.66.598-1.216 1.153-1.772.5-.508 1.105-.902 1.772-1.153.637-.247 1.363-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.058-.976.045-1.505.207-1.858.344-.466.181-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.04 0 2.672.01 2.988.058 4.042.045.976.207 1.505.344 1.857.181.466.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.04.058 2.672 0 2.988-.01 4.042-.058.976-.045 1.505-.207 1.857-.344.466-.181.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.352.3-.882.344-1.857.048-1.054.058-1.37.058-4.041 0-2.67-.01-2.986-.058-4.04-.045-.976-.207-1.505-.344-1.858-.181-.466-.398-.8-.748-1.15-.35-.35-.683-.566-1.15-.748-.353-.137-.882-.3-1.857-.344-1.054-.048-1.37-.058-4.041-.058zm0 11.531a3.333 3.333 0 100-6.666 3.333 3.333 0 000 6.666zm0-8.469a5.136 5.136 0 110 10.272 5.136 5.136 0 010-10.272zm6.538-2.264a1.2 1.2 0 11-2.4 0 1.2 1.2 0 012.4 0z" />
                    </svg>
                  </a>
                  
                  <a
                    href="https://linkedin.com/company/oslolanguages"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
                    aria-label="LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form Column */}
            <div className="lg:col-span-3">
              <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-xl border border-blue-100 p-8 transform transition-all duration-300 hover:shadow-2xl">
                <h2 className="text-3xl font-bold text-blue-800 mb-6">Send us a Message</h2>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section with call-to-action */}
      <section className="py-16 bg-gradient-to-r from-indigo-50 to-blue-50 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-200 rounded-full opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl max-w-3xl mx-auto border border-blue-100">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Language Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Contact us today to learn more about our courses or visit our school in Oslo.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link 
                href="/courses"
                className="inline-flex justify-center items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md"
              >
                Explore Our Courses
              </Link>
              <a 
                href="https://maps.google.com/?q=Oslo+Languages,Oslo,Norway"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex justify-center items-center bg-white text-blue-600 border-2 border-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                <MapPin className="w-5 h-5 mr-2" />
                Get Directions
              </a>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}