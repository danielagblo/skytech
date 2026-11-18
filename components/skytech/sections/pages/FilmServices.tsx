"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useLenis } from "lenis/react";
import BookMeetingButton from "@/components/skytech/ui/BookMeetingButton";
import FilmNav from "@/components/skytech/layout/FilmNav";
import { useRise } from "@/components/skytech/motion/useRise";
import type { BlogPost } from "@/app/lib/blog";
import { SERVICE_MENUS, type ServiceMenu } from "@/lib/crm/service-offers";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const tourIndustries = ["Hospitality", "Hotels", "Apartments", "Airbnb", "Event centres", "Real estate"];

function money(amount: number | null | undefined) {
  if (amount == null) return "Priced with the brief";
  return `GH₵${amount.toLocaleString("en-GH")}`;
}

function menuOffer(menus: ServiceMenu[], id: string, offerId?: string) {
  const menu = menus.find((item) => item.id === id);
  if (!menu) return null;
  if (offerId) {
    return (
      menu.offers.find((offer) => offer.id === offerId) ||
      menu.offers.find((offer) => offer.name.toLowerCase().includes(offerId)) ||
      null
    );
  }
  return menu.offers.find((offer) => offer.featured) || menu.offers[0] || null;
}

function buildServices(menus: ServiceMenu[]) {
  const websiteBasic = menuOffer(menus, "website", "basic");
  const websiteStandard = menuOffer(menus, "website", "standard");
  const websiteShop = menuOffer(menus, "website", "ecommerce");
  const appStart = menuOffer(menus, "app", "growth");
  const seoStart = menuOffer(menus, "seo", "silver");
  const seoGold = menuOffer(menus, "seo", "gold");
  const tourStart = menuOffer(menus, "tour", "space");

  return [
    {
      kicker: "Website",
      line: "They land on the page. They should be able to ask, book, or pay.",
      body: "The site is written around that step. Hosting, the domain, search on the page, and someone who still answers are in the same offer, from Skytech Ghana in Accra.",
      price: `For only ${money(websiteStandard?.total)}`,
      note: `A simpler site starts at ${money(websiteBasic?.total)}. A shop or booking site starts at ${money(websiteShop?.total)}.`,
      href: "/pricing?service=website",
      media: "mark" as const,
    },
    {
      kicker: "Mobile app",
      line: "The customer finishes the job on their phone.",
      body: "Use an app when the next step is a payment, a booking, or a status they check again. Android and iOS, and your desk sees the same job.",
      price: `Starts at ${money(appStart?.total)}`,
      note: "8 to 12 screens, the admin side, and the store listing. A larger build is on the rate card.",
      href: "/pricing?service=app",
      media: "image" as const,
      image: "/images/images/onlineEcommerceImage.png",
      imageAlt: "A customer completing an order",
    },
    {
      kicker: "SEO",
      line: "They search. Your business should be the one they find.",
      body: "A new site does not show up because it launched. Each month we work the words customers type, the pages that should answer, and your listing in Accra.",
      price: `From ${money(seoStart?.total)} a month`,
      note: `Most sites take the plan at ${money(seoGold?.total)} a month, with a review every two weeks.`,
      href: "/pricing?service=seo",
      media: "image" as const,
      image: "/images/images/globeImage.png",
      imageAlt: "Search bringing a business up when a customer looks",
    },
    {
      kicker: "Virtual tour",
      line: "Walk the room before you book.",
      body: "A guest, a buyer, or an organiser moves through the space before they arrive. Built for hospitality and property.",
      price: `For only ${money(tourStart?.total)}`,
      note: tourIndustries.join(" · "),
      href: "/pricing?service=tour",
      media: "video" as const,
    },
    {
      kicker: "Customer management software",
      line: "Keep every customer in one place.",
      body: "When someone calls or writes in, their name stays here with what they asked for and whether they have paid. You always know who needs a follow-up next.",
      price: "GH₵200 a month",
      note: "Or GH₵2,400 for the year.",
      href: "/pricing?service=crm",
      media: "image" as const,
      image: "/images/crm-board-crop.jpg",
      imageAlt: "Customer list showing names, requests, and payment status",
    },
  ];
}

const steps = [
  { label: "01", title: "The brief", body: "What the business sells, and the step a customer should take." },
  { label: "02", title: "The build", body: "Design, pages, and the offer, made in Accra." },
  { label: "03", title: "The year after", body: "Hosting, domain, search, and a person who still answers." },
];

export default function FilmServices({
  posts = [],
  menus = SERVICE_MENUS,
}: {
  posts?: BlogPost[];
  menus?: ServiceMenu[];
}) {
  const services = buildServices(menus);
  const ref = useRise<HTMLDivElement>();
  const root = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useLenis(() => {
    ScrollTrigger.update();
  });

  useGSAP(() => {
    const motion = gsap.matchMedia();
    motion.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const pin = pinRef.current;
      if (!pin) return;
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", pin);
      if (panels.length < 2) return;

      gsap.set(pin, { height: "calc(100svh - 7.5rem)", overflow: "hidden" });
      panels.forEach((panel, index) => {
        gsap.set(panel, {
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          zIndex: index + 1,
          yPercent: index === 0 ? 0 : 100,
        });
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none", duration: 1 },
        scrollTrigger: {
          trigger: pin,
          start: "top 20px",
          end: () => "+=" + (panels.length - 1) * window.innerHeight * 0.85,
          pin: pin,
          pinType: "transform",
          scrub: 0.45,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      panels.forEach((panel, index) => {
        if (index === 0) return;
        timeline.to(panel, { yPercent: 0 }, index - 1);
        timeline.to(panels[index - 1], { backgroundColor: "#e6e6e4" }, index - 1);
      });

      gsap.to("[data-chev]", {
        x: 12,
        duration: 0.85,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    });
    return () => motion.revert();
  }, { scope: root });

  return (
    <div ref={ref} className="px-3 pb-16 pt-4 md:px-5 md:pt-5">
      <div ref={root} className="mx-auto max-w-[1280px]">
        <FilmNav />
        <div ref={pinRef} className="relative mt-4 overflow-visible rounded-[28px] bg-white">
          {services.map((service, index) => (
            <article
              key={service.kicker}
              data-panel
              className="grid items-center gap-6 bg-white px-5 py-8 md:grid-cols-[auto_minmax(0,1fr)] md:gap-12 md:px-12"
            >
              <p className="font-display text-[clamp(5.5rem,11vw,8.5rem)] font-medium leading-[0.8] tracking-tight">
                {index + 1}
              </p>
              <div className="max-w-xl">
                <p className="text-xs text-black/40">({service.kicker})</p>
                <h2 className="mt-3 font-display text-3xl font-medium leading-[1.02] tracking-tight md:text-[2.6rem]">
                  {service.line}
                </h2>
                <ServiceMedia service={service} />
                <p className="mt-4 text-sm leading-relaxed text-black/55">{service.body}</p>
                <p className="mt-4 inline-flex rounded-full bg-[#161616] px-4 py-1.5 text-sm font-medium text-white">
                  {service.price}
                </p>
                <p className="mt-3 text-xs leading-relaxed text-black/45">{service.note}</p>
                <Link href={service.href} className="mt-3 inline-block text-sm underline decoration-black/30 underline-offset-4">
                  See this offer
                </Link>
              </div>
            </article>
          ))}

          <article data-panel className="flex flex-col justify-center bg-white px-5 py-10 md:px-12">
            <h2 className="max-w-3xl font-display text-5xl font-medium leading-[0.9] tracking-tight md:text-7xl">
              HOW THE WORK MOVES
            </h2>
            <div className="mt-8 grid gap-3 md:grid-cols-3">
              {steps.map((step) => (
                <div key={step.label} className="rounded-2xl bg-[#f6f6f4] p-5">
                  <p className="text-[11px] uppercase tracking-[0.16em] text-black/40">{step.label}</p>
                  <h3 className="mt-2 font-display text-2xl font-medium">{step.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/55">{step.body}</p>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/pricing" className="rounded-full bg-[#161616] px-5 py-2.5 text-sm font-medium text-white">
                See the offers
              </Link>
              <BookMeetingButton className="rounded-full border border-black/15 px-5 py-2.5 text-sm font-medium">
                Book a meeting
              </BookMeetingButton>
            </div>
          </article>
        </div>

      {posts.length > 0 ? (
        <section data-rise className="mt-4">
          <div className="flex flex-wrap items-end justify-between gap-4 px-1">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">Insights</p>
              <h2 className="mt-2 font-display text-4xl font-medium tracking-tight md:text-5xl">Notes on the work.</h2>
            </div>
            <Link href="/insights" className="rounded-full bg-white px-4 py-2 text-sm font-medium">
              All articles
            </Link>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {posts.map((post) => (
              <Link key={post.slug} href={`/insights/${post.slug}`} className="overflow-hidden rounded-[28px] bg-white">
                {post.coverImage ? (
                  <span className="relative block h-44">
                    <Image src={post.coverImage} alt="" fill className="object-cover" sizes="380px" />
                  </span>
                ) : null}
                <span className="block p-5">
                  <span className="text-[11px] uppercase tracking-[0.16em] text-black/40">{post.category || "Notes"}</span>
                  <span className="mt-2 block font-display text-2xl font-medium leading-tight tracking-tight">{post.title}</span>
                  <span className="mt-3 block text-sm leading-relaxed text-black/60">{post.excerpt}</span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
      </div>
    </div>
  );
}

function ServiceMedia({ service }: { service: ReturnType<typeof buildServices>[number] }) {
  if (service.media === "mark") {
    return (
      <div className="mt-6 inline-flex h-24 w-36 items-center justify-center rounded-2xl bg-[#d5f5a8]">
        <span data-chev className="font-display text-4xl font-medium tracking-tighter text-[#161616]">{">>"}</span>
      </div>
    );
  }
  if (service.media === "video") {
    return (
      <div className="relative mt-6 h-36 w-full max-w-sm overflow-hidden rounded-2xl bg-black">
        <video
          src="/videos/virtual-tour.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
          aria-label="A walk through a property before you book"
        />
      </div>
    );
  }
  return (
    <div className="relative mt-6 h-36 w-full max-w-sm overflow-hidden rounded-2xl bg-[#f3f3f1]">
      <Image src={service.image || ""} alt={service.imageAlt || ""} fill className="object-cover" sizes="420px" />
    </div>
  );
}
