"use client";

import { useState } from "react";
import { useWhatsAppModal } from "@/components/WhatsAppModal";
import {
  SERVICE_MENUS,
  serviceMenu,
  type ServiceKey,
  type ServiceMenu,
} from "@/lib/crm/service-offers";

export default function ServiceOffers({
  initial = "website",
  syncUrl = false,
  menus = SERVICE_MENUS,
}: {
  initial?: string;
  syncUrl?: boolean;
  menus?: ServiceMenu[];
}) {
  const { open } = useWhatsAppModal();
  const list = menus?.length ? menus : SERVICE_MENUS;
  const [service, setService] = useState<ServiceKey>(
    (list.find((item) => item.id === initial)?.id || list[0]?.id || "website") as ServiceKey,
  );
  const menu = list.find((item) => item.id === service) || list[0] || serviceMenu(initial);
  const money = (amount: number) => `GH₵${amount.toLocaleString("en-GH")}`;

  const choose = (id: ServiceKey) => {
    setService(id);
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    url.searchParams.set("service", id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
  };

  return (
    <div>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {list.map((item) => {
          const active = item.id === menu.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => choose(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium ${
                active
                  ? "bg-[#161616] text-white"
                  : item.id === "tour"
                    ? "bg-[#d5f5a8] text-[#161616]"
                    : "bg-white text-[#161616]"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-black/60">{menu.note}</p>
      <div className="mt-6 grid gap-3 lg:grid-cols-3">
        {menu.offers.map((offer) => {
          const featured = Boolean(offer.featured);
          const packageName = menu.id === "website" ? offer.name : `${menu.label} · ${offer.name}`;
          return (
            <article
              key={offer.id}
              className={`rounded-[28px] p-6 ${featured ? "bg-[#161616] text-white" : "bg-white"}`}
            >
              <p className={`text-xs uppercase tracking-[0.16em] ${featured ? "text-white/55" : "text-black/45"}`}>
                {offer.eyebrow}
              </p>
              <h2 className="mt-3 font-display text-3xl font-medium tracking-tight">{offer.name}</h2>
              {offer.total != null ? (
                <p className="mt-3 font-display text-4xl">
                  {money(offer.total)}
                  {offer.period ? <span className="text-lg font-medium"> {offer.period}</span> : null}
                </p>
              ) : (
                <p className="mt-3 font-display text-3xl leading-tight">Priced with the brief</p>
              )}
              <ul className={`mt-5 space-y-2 border-t pt-4 text-sm ${featured ? "border-white/15" : "border-black/10"}`}>
                {offer.items.map((item) => (
                  <li key={item.description} className="flex justify-between gap-3">
                    <span>{item.description}</span>
                    {item.unitPrice != null ? <span>{money(item.unitPrice)}</span> : null}
                  </li>
                ))}
              </ul>
              {offer.renewal != null ? (
                <p className={`mt-4 text-xs ${featured ? "text-white/55" : "text-black/45"}`}>
                  Renewal {money(offer.renewal)}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() =>
                  open({
                    packageName,
                    packagePrice: offer.total != null ? `${money(offer.total)}${offer.period || ""}` : undefined,
                  })
                }
                className={`mt-6 w-full rounded-full px-4 py-3 text-sm font-medium ${
                  featured ? "bg-white text-[#161616]" : "bg-[#161616] text-white"
                }`}
              >
                {offer.total != null ? "Claim this offer" : "Ask for this offer"}
              </button>
            </article>
          );
        })}
      </div>
    </div>
  );
}
