// src/app/(marketing)/privacy-policy/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Oslo Languages",
  description: "Privacy policy for Oslo Languages website and courses.",
};

export default function PrivacyPolicy() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Privacy Policy</h1>
        
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
              <p className="text-gray-700">
                Oslo Languages (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information 
                when you visit our website or use our services.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
              <p className="text-gray-700">
                We collect information you provide directly to us, such as when you fill out 
                our contact form, register for courses, or subscribe to our newsletter. This 
                may include your name, email address, phone number, and any other information 
                you choose to provide.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
              <p className="text-gray-700">
                We use the information we collect to provide, maintain, and improve our services, 
                to communicate with you about courses and events, and to respond to your inquiries.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Cookies and Tracking Technologies</h2>
              <p className="text-gray-700">
                Our website may use cookies and similar tracking technologies to enhance your experience
                and collect information about how you use our site.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Contact Us</h2>
              <p className="text-gray-700">
                If you have any questions about this Privacy Policy, please contact us at
                <a href="mailto:contact@oslolanguages.no" className="text-blue-600 ml-1">
                  contact@oslolanguages.no
                </a>.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <Link 
            href="/legal" 
            className="text-blue-600 hover:underline"
          >
            View All Legal Information
          </Link>
        </div>
      </div>
    </section>
  );
}