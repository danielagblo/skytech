import { ReactNode } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { getSettings } from '../lib/settings';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';

export async function generateMetadata() {
  const settings = await getSettings();
  const title = settings.siteName || "Skytech Ghana";
  const description =
    settings.siteDescription ||
    "Website design, mobile apps, SEO and growth features for businesses in Ghana.";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const settings = await getSettings();
  return (
    <>
      <Header siteName={settings.siteName} />
      {children}
      <Footer settings={settings} />
      <FloatingWhatsApp whatsapp={settings.whatsapp} />
    </>
  );
}
