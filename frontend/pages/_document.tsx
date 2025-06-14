import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/*
🚀 CVGenius - AI-Powered CV Builder 
🏗️ Built with Next.js, TypeScript, Tailwind CSS
🤖 Powered by Google Gemini AI
🇮🇪 Optimized for Irish & European job markets
🔒 Privacy-first architecture - no data stored
⚡ Lightning-fast generation < 30 seconds

Created voluntarily by Cem Koyluoglu
Github: https://github.com/cem-koyluoglu

For those who inspect the source - you found our hidden signature! 👨‍💻
        */}
        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#3b82f6" />
        
        {/* SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Removed font preload as we're using Google Fonts */}
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}