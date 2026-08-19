import { ReactNode } from 'react';
import Navigation from '../../components/skytech/layout/Navigation';
import Footer from '../../components/skytech/layout/Footer';
import { getSettings } from '../lib/settings';
import { getLatestBlogPosts } from '../lib/blog';
import { getAffiliates } from '../lib/affiliates';
import FloatingWhatsApp from '../../components/FloatingWhatsApp';
import TopScrollingBanner from '../../components/skytech/sections/home/TopScrollingBanner';
import { WhatsAppModalProvider } from '../../components/WhatsAppModal';
import type { WhatsAppPackageGroup } from '../../components/WhatsAppModal';
import { getPricing } from '../lib/pricing';

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
  const [latestPosts, affiliates, pricingData] = await Promise.all([
    getLatestBlogPosts(4),
    getAffiliates(),
    getPricing(),
  ]);

  const sponsors = affiliates.map((affiliate) => ({
    name: affiliate.name,
    logoUrl: affiliate.logoUrl,
  }));

  const waPackages: WhatsAppPackageGroup[] = pricingData.map((cat) => ({
    group: cat.label,
    items: cat.packages.map((p) => {
      const suffix = p.interval ? `/${p.interval}` : "";
      return `${p.name} – GHC ${p.price}${suffix}`;
    }),
  }));

  return (
    <WhatsAppModalProvider whatsapp={settings.whatsapp} packages={waPackages}>
      <div className="fixed top-[56px] md:top-0 w-full z-20 md:z-30">
        <TopScrollingBanner contactPhone={settings.contactPhone} whatsapp={settings.whatsapp} />
      </div>
      <Navigation className="fixed top-0 left-0 z-30 w-full md:top-[45px]" />
      <main>{children}</main>
      <Footer latestPosts={latestPosts} sponsors={sponsors} settings={settings} />
      <FloatingWhatsApp whatsapp={settings.whatsapp} />
    </WhatsAppModalProvider>
  );
}
