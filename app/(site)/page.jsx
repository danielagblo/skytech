import React from "react";
export const dynamic = "force-dynamic";
import { getAffiliates } from "../lib/affiliates";
import { getHeroData } from "../lib/hero";
import { getTestimonials } from "../lib/testimonials";

import FilmHome from "../../components/skytech/sections/home/FilmHome";

export const metadata = {
  title: "Skytech Ghana - Website Development Company in Ghana | Mobile App Developers",
  description:
    "Skytech Ghana builds websites, mobile apps, SEO, virtual tours, and CRM for businesses in Ghana.",
};

export default async function Home() {
  const [hero, partnersData, testimonials] = await Promise.all([
    getHeroData(),
    getAffiliates(),
    getTestimonials(),
  ]);
  const allPartners = (partnersData || []).filter((p) => p?.logoUrl || p?.name);
  const reviews = (testimonials || [])
    .filter((item) => item?.quote)
    .map((item) => ({
      result: item.company || "Customer story",
      quote: item.quote,
      name: item.author || "Client",
      company: item.company || "Ghana",
    }));

  return (
    <FilmHome subText={hero.subText} partners={allPartners} reviews={reviews} />
  );
}
