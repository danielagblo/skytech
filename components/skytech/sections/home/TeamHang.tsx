"use client";

import { useState } from "react";
import Image from "next/image";

export interface HangMember {
  name: string;
  role: string;
  bio: string;
  image?: string;
  position?: string;
  detail?: string;
}

const seats: HangMember[] = [
  {
    name: "Websites",
    role: "The build",
    detail: "First screen",
    bio: "The first screen a customer meets. Written for the offer, built to load, and ready for the next step.",
    image: "/images/images/DrivenByInnovationImage.png",
    position: "center 18%",
  },
  {
    name: "Apps",
    role: "The product",
    detail: "In the hand",
    bio: "Mobile work a customer can finish. Skytech Ghana stays on the app after the site.",
    image: "/images/images/manSitting.png",
    position: "18% center",
  },
  {
    name: "Search",
    role: "After launch",
    detail: "Still findable",
    bio: "The launch week is not the finish. We keep the site findable after the first campaign ends.",
    image: "/images/images/manFixingCamera.png",
    position: "center",
  },
  {
    name: "Care",
    role: "Still here",
    detail: "Still here",
    bio: "Hosting, domain, and the person who still answers. No handoff once the invoice is paid.",
    image: "/images/icons/support-agent.jpg",
    position: "center 20%",
  },
];

function people(members: HangMember[]) {
  const source = members.filter((member) => member.name);
  if (source.length === 0) return seats;
  return source.map((member, index) => ({
    ...seats[index % seats.length],
    ...member,
    image: member.image || seats[index % seats.length].image,
    position: member.position || seats[index % seats.length].position,
    detail: member.detail || member.role,
  }));
}

function HangCard({ person, index }: { person: HangMember; index: number }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = [-2.4, 1.6, -1.2, 2.1][index % 4];

  return (
    <div
      data-flipped={flipped ? "true" : "false"}
      className="team-card flex w-[220px] shrink-0 flex-col items-center"
      style={{ ["--tilt" as string]: `${tilt}deg` }}
    >
      <span className="h-7 w-px bg-black/30" />
      <button
        type="button"
        aria-pressed={flipped}
        onClick={() => setFlipped((value) => !value)}
        className="w-full text-left"
      >
        <span className="block [perspective:900px]">
          <span
            className="relative block h-[360px] w-full transition-transform duration-700 [transform-style:preserve-3d]"
            style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
          >
            <span className="absolute inset-0 flex flex-col overflow-hidden rounded-[26px] bg-white p-3 shadow-[0_18px_40px_rgba(20,20,20,.12)] [backface-visibility:hidden]">
              <span className="flex items-center justify-between px-1 text-[10px] uppercase tracking-[0.16em] text-black/40">
                <span>Skytech</span>
                <span>0{index + 1}</span>
              </span>
              <span className="relative mt-2 h-44 overflow-hidden rounded-[18px] bg-[#f3f3f1]">
                <Image
                  src={person.image || seats[0].image || ""}
                  alt=""
                  fill
                  className="object-cover"
                  style={{ objectPosition: person.position }}
                  sizes="220px"
                />
              </span>
              <span className="mt-4 px-1 font-display text-2xl font-medium tracking-tight">{person.name}</span>
              <span className="px-1 text-sm text-black/55">{person.role}</span>
              <span className="mt-auto flex items-center justify-between px-1 pb-1 text-[11px] uppercase tracking-[0.14em] text-black/45">
                <span>{flipped ? "Close" : "Turn"}</span>
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#161616] text-white">↗</span>
              </span>
            </span>
            <span className="absolute inset-0 flex flex-col overflow-hidden rounded-[26px] bg-gradient-to-br from-[#d7f3b0] via-[#eef8d4] to-[#c5e7f8] p-5 [backface-visibility:hidden] [transform:rotateY(180deg)]">
              <span className="text-[10px] uppercase tracking-[0.16em] text-black/45">{person.detail}</span>
              <span className="mt-4 font-display text-2xl font-medium tracking-tight">{person.name}</span>
              <span className="mt-1 text-sm text-black/60">{person.role}</span>
              <span className="mt-4 text-sm leading-relaxed text-[#161616]">{person.bio}</span>
              <span className="mt-auto text-xs text-black/55">hello@skytechgh.com</span>
            </span>
          </span>
        </span>
      </button>
    </div>
  );
}

export default function TeamHang({ members = [] }: { members?: HangMember[] }) {
  const list = people(members);

  return (
    <section className="relative px-3 pb-4 md:px-5">
      <style>{`
        .team-card { transform: rotate(var(--tilt)); transform-origin: top center; }
        @media (prefers-reduced-motion: no-preference) {
          .team-rail:hover .team-card[data-flipped="false"] {
            animation: team-sway 1.8s ease-in-out infinite;
          }
        }
        @keyframes team-sway {
          0%, 100% { transform: rotate(var(--tilt)); }
          50% { transform: rotate(calc(var(--tilt) + 2.2deg)); }
        }
      `}</style>
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-[#f6f6f4] px-5 py-12 md:px-10 md:py-16">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">The people</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-medium tracking-tight md:text-6xl">
              Meet the people behind the <span className="rounded-full bg-[#d5f5a8] px-3">work.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-black/55">
            Websites, mobile apps, SEO, virtual tours, and CRM. Based in Accra.
            Hover to sway. Click a card to turn it.
          </p>
        </div>

        <div className="team-rail relative mt-10">
          <div className="pointer-events-none absolute left-8 right-8 top-3 h-px bg-black/25" />
          <div className="flex gap-5 overflow-x-auto px-2 pb-4 pt-3 md:justify-center md:gap-8">
            {list.map((person, index) => (
              <HangCard key={`${person.name}-${index}`} person={person} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
