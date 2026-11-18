import { ReactNode, Suspense } from 'react';
import AnalyticsTracker from '../../components/AnalyticsTracker';
import Footer from '../../components/skytech/layout/Footer';
import { getSettings } from '../lib/settings';
import { getLatestBlogPosts } from '../lib/blog';
import { getAffiliates } from '../lib/affiliates';
import FilmFrame from '../../components/skytech/layout/FilmFrame';
import SmoothScroll from '../../components/skytech/layout/SmoothScroll';
import { WhatsAppModalProvider } from '../../components/WhatsAppModal';

export async function generateMetadata() {
  const settings = await getSettings();
  const title = settings.siteName || "Skytech Ghana";
  const description =
    settings.siteDescription ||
    "Website design, mobile apps, SEO, virtual tours, and CRM for businesses in Ghana.";

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
    <SmoothScroll>
      <WhatsAppModalProvider whatsapp={settings.whatsapp}>
        <div className="studio-page min-h-screen">
          <Suspense fallback={null}>
            <AnalyticsTracker />
          </Suspense>
          <FilmFrame>
            <main>{children}</main>
          </FilmFrame>
          <Footer latestPosts={latestPosts} sponsors={sponsors} settings={settings} />
        </div>
      </WhatsAppModalProvider>
    </SmoothScroll>
  );
}
