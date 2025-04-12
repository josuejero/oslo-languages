
import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "@/styles/globals.css";


const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Oslo Languages | Language Courses in Oslo",
  description:
    "Learn Norwegian, English, and Spanish with Oslo Languages. Quality language education in Oslo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Oslo Languages",
    url: "https://www.oslolanguages.com",
    logo: "https://www.oslolanguages.com/logo.png",
    sameAs: [
      "https://www.facebook.com/oslolanguages",
      "https://www.instagram.com/oslolanguages"
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+47-22-33-44-55",
      contactType: "customer service",
      availableLanguage: ["English", "Norwegian", "Spanish"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Karl Johans gate 25",
      addressLocality: "Oslo",
      postalCode: "0159",
      addressCountry: "NO",
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${robotoMono.variable} h-full`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      {}
      <body className="min-h-screen flex flex-col bg-white">
        <Header />
        <main id="main-content" className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}