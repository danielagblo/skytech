import { ReactNode } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getSettings } from '../lib/settings';

export default function SiteLayout({ children }: { children: ReactNode }) {
  const settings = getSettings();
  return (
    <>
      <Header siteName={settings.siteName} />
      {children}
      <Footer settings={settings} />
    </>
  );
}
