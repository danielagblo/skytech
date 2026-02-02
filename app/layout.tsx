import { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import '../index.css';

export const metadata = {
  title: 'SkyTech',
  description: 'SkyTech - Website & Mobile App Developers',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/bricskylogo.png" />
        <link rel="apple-touch-icon" href="/bricskylogo.png" />
      </head>
      <body>
        {children}
        
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-17868191918"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17868191918');
          `}
        </Script>
      </body>
    </html>
  );
}
