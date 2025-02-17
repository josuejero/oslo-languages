import type { Metadata } from "next";
import type { AppProps } from 'next/app';
import { Inter } from "next/font/google";
import { useEffect } from 'react';
import Head from 'next/head';
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ErrorBoundary from '@/components/ErrorBoundary';
import AuthProvider from '@/components/providers/AuthProvider';
import "@/styles/globals.css";

// Initialize Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: '--font-inter',
});

/**
 * Global metadata for SEO and browser tab display.
 * @type {Metadata}
 */
export const metadata: Metadata = {
  title: "Oslo Languages - Language School in Oslo",
  description: "Learn languages with Oslo's premier language school. We offer courses in Norwegian, English, Spanish and more.",
  keywords: "language school oslo, norwegian courses, english courses, spanish courses, language learning norway",
};

/**
 * Custom App component wrapping the application with providers and layout.
 * Includes Netlify CMS integration and identity management.
 *
 * @param {AppProps} props - The props passed to the component.
 * @returns {JSX.Element} The rendered application.
 */
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Initialize Netlify Identity integration
  useEffect(() => {
    // Load Netlify Identity script
    if (typeof window !== 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://identity.netlify.com/v1/netlify-identity-widget.js';
      script.async = true;
      document.head.appendChild(script);

      // Handle Netlify Identity initialization
      script.onload = () => {
        if (window.netlifyIdentity) {
          window.netlifyIdentity.on('init', user => {
            if (!user) {
              window.netlifyIdentity.on('login', () => {
                window.location.href = '/admin/';
              });
            }
          });
        }
      };

      // Cleanup
      return () => {
        script.remove();
      };
    }
  }, []);

  return (
    <>
      <Head>
        {/* Add meta tags for Netlify CMS */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://identity.netlify.com" />
        <link rel="dns-prefetch" href="https://identity.netlify.com" />
      </Head>

      <AuthProvider>
        <div className={`${inter.variable} font-sans antialiased min-h-screen flex flex-col`}>
          <ErrorBoundary>
            <Header />
            <main id="main-content" className="flex-grow" tabIndex={-1}>
              <Component {...pageProps} />
            </main>
            <Footer />
          </ErrorBoundary>
        </div>
      </AuthProvider>
    </>
  );
}

// Add type definition for window.netlifyIdentity
declare global {
  interface Window {
    netlifyIdentity: {
      on: (event: string, callback: (user?: any) => void) => void;
    };
  }
}