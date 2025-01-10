import ContactForm from '@/components/widgets/ContactForm';

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
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
                <p className="text-text-secondary">
                  123 Business Street<br />
                  Suite 100<br />
                  City, State 12345
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Phone</h3>
                <p className="text-text-secondary">(123) 456-7890</p>
              </div>
              <div>
                <h3 className="font-semibold text-text-primary">Email</h3>
                <p className="text-text-secondary">info@yourcompany.com</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-4 text-text-primary">Business Hours</h2>
            <div className="space-y-2">
              <p className="text-text-secondary">
                <span className="font-semibold text-text-primary">Monday - Friday:</span> 9:00 AM - 6:00 PM
              </p>
              <p className="text-text-secondary">
                <span className="font-semibold text-text-primary">Saturday:</span> 10:00 AM - 4:00 PM
              </p>
              <p className="text-text-secondary">
                <span className="font-semibold text-text-primary">Sunday:</span> Closed
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-bg-secondary p-6 rounded-lg shadow-lg border border-text-secondary">
          <h2 className="text-2xl font-semibold mb-6 text-text-primary">Send us a Message</h2>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}