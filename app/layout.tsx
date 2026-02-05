import { ReactNode } from 'react';
import Script from 'next/script';
import './globals.css';
import '../index.css';
import AnalyticsTracker from '../components/AnalyticsTracker';

export const metadata = {
  title: 'SkyTech',
  description: 'SkyTech - Website & Mobile App Developers',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
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
