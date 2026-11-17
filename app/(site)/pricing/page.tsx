import FilmPricing from "@/components/skytech/sections/pages/FilmPricing";
import { getFAQs } from "@/app/lib/faqs";

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
  const faqs = await getFAQs();
  const questions = (faqs || [])
    .filter((item) => item?.question && item?.answer)
    .map((item) => ({ question: item.question, answer: item.answer }));

  return <FilmPricing faqs={questions} initial={raw} />;
}
