// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import "@/styles/globals.css";
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps): JSX.Element {
  // Add startup logging
  console.log('_app.tsx: Application starting...');
  
  useEffect(() => {
    console.log('_app.tsx: Component mounted');
    
    // Log any environment variables that might be causing issues (without exposing secrets)
    console.log('_app.tsx: Environment check', {
      hasBaseUrl: !!process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV
    });
    
    return () => {
      console.log('_app.tsx: Component unmounting');
    };
  }, []);

  console.log('_app.tsx: Rendering application layout');
  
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <div className="font-sans antialiased min-h-screen flex flex-col">
        <Header />
        <main id="main-content" className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
    </>
  );
}