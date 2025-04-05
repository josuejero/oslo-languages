// src/app/(marketing)/legal/page.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legal Information | Oslo Languages",
  description: "Privacy policy and terms of service for Oslo Languages website and courses.",
};

export default function Legal() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-8 text-center text-text-primary animate-fadeIn">Legal Information</h1>
        
        <div className="bg-background-primary p-8 rounded-lg shadow mb-8 hover:shadow-lg transition-all duration-300 animate-fadeIn delay-100">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">Privacy Policy</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-text-primary">1. Introduction</h3>
              <p className="text-text-secondary">
                Oslo Languages (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. 
                This Privacy Policy explains how we collect, use, and safeguard your information 
                when you visit our website or use our services.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-text-primary">2. Information We Collect</h3>
              <p className="text-text-secondary">
                We collect information you provide directly to us, such as when you fill out 
                our contact form, register for courses, or subscribe to our newsletter. This 
                may include your name, email address, phone number, and any other information 
                you choose to provide.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-text-primary">3. How We Use Your Information</h3>
              <p className="text-text-secondary">
                We use the information we collect to provide, maintain, and improve our services, 
                to communicate with you about courses and events, and to respond to your inquiries.
              </p>
            </div>
            
            {/* More privacy policy sections would go here */}
          </div>
        </div>
        
        <div className="bg-background-primary p-8 rounded-lg shadow hover:shadow-lg transition-all duration-300 animate-fadeIn delay-200">
          <h2 className="text-2xl font-semibold mb-4 text-text-primary">Terms of Service</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2 text-text-primary">1. Acceptance of Terms</h3>
              <p className="text-text-secondary">
                By accessing or using our website, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, 
                you are prohibited from using or accessing this site.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-text-primary">2. Course Registration and Payment</h3>
              <p className="text-text-secondary">
                Course registrations are confirmed upon receipt of payment. Payment methods 
                and refund policies are specified during the registration process.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2 text-text-primary">3. Intellectual Property</h3>
              <p className="text-text-secondary">
                The content, organization, graphics, design, and other matters related to the 
                Site are protected under applicable copyrights and other proprietary laws. 
                Copying, redistribution, use or publication of any such Content is strictly prohibited.
              </p>
            </div>
            
            {/* More terms of service sections would go here */}
          </div>
        </div>
      </div>
    </section>
  );
}