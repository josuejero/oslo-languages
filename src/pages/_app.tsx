import type { Metadata } from "next";
import type { AppProps } from 'next/app';
import { Inter } from "next/font/google";
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import ErrorBoundary from '@/components/ErrorBoundary';
import AuthProvider from '@/components/providers/AuthProvider';
import "@/styles/globals.css"; // Importing global CSS

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
 *
 * @param {AppProps} props - The props passed to the component.
 * @returns {JSX.Element} The rendered application.
 */
export default function App({ Component, pageProps }: AppProps): JSX.Element {
  return (
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
  );
}
