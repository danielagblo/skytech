import React from "react";
export const dynamic = "force-dynamic";
import { getAffiliates } from "../lib/affiliates";
import { getTeamMembers } from "../lib/team";
import { getTestimonials } from "../lib/testimonials";
import { getServiceMenus } from "../lib/pricing-display";

import FilmHome from "../../components/skytech/sections/home/FilmHome";

export const metadata = {
  title: "Skytech Ghana - Website Development Company in Ghana | Mobile App Developers",
  description:
    "Skytech Ghana builds websites, mobile apps, SEO, virtual tours, and CRM for businesses in Ghana.",
};

export default async function Home() {
  const [partnersData, testimonials, team, menus] = await Promise.all([
    getAffiliates(),
    getTestimonials(),
    getTeamMembers(),
    getServiceMenus(),
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
  const members = (team || [])
    .filter((member) => member?.name)
    .map((member) => ({
      name: member.name,
      role: member.role || "",
      bio: member.bio || "",
      image: member.imageUrl || undefined,
      detail: member.role || "",
    }));

  return <FilmHome partners={allPartners} reviews={reviews} members={members} menus={menus} />;
}
