// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// Configure your Google fonts as normal
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Next.js 13 metadata
export const metadata: Metadata = {
  title: "Oslo Languages | Language Courses in Oslo",
  description: "Learn Norwegian, English, and Spanish with Oslo Languages. Quality language education in Oslo.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* 1. Insert custom <head> content here */}
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Oslo Languages",
              url: "https://oslolanguages.no",
              logo: "https://oslolanguages.no/images/logo.png",
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+47-22-33-44-55",
                contactType: "customer service",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "Karl Johans gate 25",
                addressLocality: "Oslo",
                postalCode: "0159",
                addressCountry: "NO",
              },
            }),
          }}
        />
      </head>

      {/* 2. Layout body starts here */}
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
