import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';
import Head from 'next/head';
import { Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import EnvironmentIndicator from '@/components/ui/EnvironmentIndicator';
import '@/styles/globals.css';
import { useEffect } from 'react';

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  // Suppress browser extension errors
  useEffect(() => {
    // Suppress runtime.lastError warnings from browser extensions
    const originalError = console.error;
    console.error = (...args) => {
      if (
        args[0] && 
        typeof args[0] === 'string' && 
        (args[0].includes('runtime.lastError') || 
         args[0].includes('Could not establish connection') ||
         args[0].includes('message port closed'))
      ) {
        return; // Suppress these specific errors
      }
      originalError.apply(console, args);
    };

    return () => {
      console.error = originalError;
    };
  }, []);

  return (
    <>
      <Head>
        <title>CVGenius - AI-Powered CV Builder & Optimizer</title>
        <meta name="description" content="Create professional ATS-friendly CVs and cover letters with AI. Build from scratch or update existing CVs for specific job applications." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="CVGenius - AI-Powered CV Builder" />
        <meta property="og:description" content="Create professional ATS-friendly CVs and cover letters with AI" />
        <meta property="og:image" content="/og-image.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="CVGenius - AI-Powered CV Builder" />
        <meta property="twitter:description" content="Create professional ATS-friendly CVs and cover letters with AI" />
        <meta property="twitter:image" content="/og-image.png" />
        
        {/* Additional SEO */}
        <meta name="keywords" content="CV builder, resume maker, ATS friendly, cover letter generator, AI CV, job application, Ireland, Europe" />
        <meta name="author" content="CVGenius" />
        <link rel="canonical" href="https://cvgenius.com" />
      </Head>
      
      <div className={inter.className}>
        <EnvironmentIndicator />
        <Component {...pageProps} />
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            className: 'toast',
            success: {
              className: 'toast-success',
            },
            error: {
              className: 'toast-error',
            },
          }}
        />
        
                  {/* Vercel Analytics */}
          <Analytics />
      </div>
    </>
  );
}