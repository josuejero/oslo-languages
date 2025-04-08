// src/app/(marketing)/terms-of-service/page.tsx
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | Oslo Languages",
  description: "Terms and conditions for using Oslo Languages services.",
};

export default function TermsOfService() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center">Terms of Service</h1>
        
        <div className="bg-white p-8 rounded-lg shadow mb-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-gray-700">
                By accessing or using our website, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using or accessing this site.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">2. Course Registration and Payment</h2>
              <p className="text-gray-700">
                Course registrations are confirmed upon receipt of payment. Payment methods 
                and refund policies are specified during the registration process.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">3. Intellectual Property</h2>
              <p className="text-gray-700">
                The content, organization, graphics, design, and other matters related to the 
                Site are protected under applicable copyrights and other proprietary laws. 
                Copying, redistribution, use or publication of any such Content is strictly prohibited.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
              <p className="text-gray-700">
                We shall not be liable for any damages whatsoever arising out of or in connection 
                with the use or inability to use our services or website.
              </p>
            </div>
            
            <div>
              <h2 className="text-2xl font-semibold mb-4">5. Changes to Terms</h2>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. Your continued use of the site
                following any changes indicates your acceptance of the new terms.
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