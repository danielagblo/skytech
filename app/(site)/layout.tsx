import { ReactNode, Suspense } from 'react';
import AnalyticsTracker from '../../components/AnalyticsTracker';
import Footer from '../../components/skytech/layout/Footer';
import { getSettings } from '../lib/settings';
import { getLatestBlogPosts } from '../lib/blog';
import { getAffiliates } from '../lib/affiliates';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import SiteChrome from '../../components/skytech/layout/SiteChrome';
import { WhatsAppModalProvider } from '../../components/WhatsAppModal';

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
  const [latestPosts, affiliates] = await Promise.all([
    getLatestBlogPosts(4),
    getAffiliates(),
  ]);

  const sponsors = affiliates.map((affiliate) => ({
    name: affiliate.name,
    logoUrl: affiliate.logoUrl,
  }));

  return (
    <WhatsAppModalProvider whatsapp={settings.whatsapp}>
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
      <SiteChrome />
      <main>{children}</main>
      <Footer latestPosts={latestPosts} sponsors={sponsors} settings={settings} />
      <FloatingWhatsApp />
    </WhatsAppModalProvider>
  );
}
