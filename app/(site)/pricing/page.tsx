import FilmPricing from "@/components/skytech/sections/pages/FilmPricing";
import { getFAQs } from "@/app/lib/faqs";
import { getServiceMenus } from "@/app/lib/pricing-display";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Pricing | Skytech Ghana",
  description: "Pricing by service: website, mobile app, SEO, virtual tour, and CRM.",
};

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string | string[] }>;
}) {
  const query = await searchParams;
  const raw = Array.isArray(query.service) ? query.service[0] : query.service;
  const [faqs, menus] = await Promise.all([getFAQs(), getServiceMenus()]);
  const questions = (faqs || [])
    .filter((item: { question?: string; answer?: string }) => item?.question && item?.answer)
    .map((item: { question: string; answer: string }) => ({ question: item.question, answer: item.answer }));

  return <FilmPricing faqs={questions} initial={raw} menus={menus} />;
}
