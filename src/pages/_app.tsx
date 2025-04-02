// src/pages/_app.tsx (simplified)
import type { AppProps } from 'next/app';
import Head from 'next/head';
import Header from "@/components/layout/header/Header";
import Footer from "@/components/layout/footer/Footer";
import "@/styles/globals.css";

export default function App({ Component, pageProps }: AppProps): JSX.Element {
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