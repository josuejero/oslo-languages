// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google"; 
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import "./globals.css";
import ErrorBoundary from '@/components/ErrorBoundary';
import React from 'react';
import AuthProvider from '@/components/providers/AuthProvider';


const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Oslo Languages - Language School in Oslo",
  description: "Learn languages with Oslo's premier language school. We offer courses in Norwegian, English, Spanish and more.",
  keywords: "language school oslo, norwegian courses, english courses, spanish courses, language learning norway",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <ErrorBoundary>
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </ErrorBoundary>
        </AuthProvider>
      </body>
    </html>
  );
}