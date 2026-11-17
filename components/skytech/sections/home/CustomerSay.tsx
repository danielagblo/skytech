"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

export interface CustomerStory {
  result: string;
  quote: string;
  name: string;
  company: string;
  image?: string;
  position?: string;
}

const photos = [
  { image: "/images/images/DrivenByInnovationImage.png", position: "center 18%" },
  { image: "/images/images/manSitting.png", position: "18% center" },
  { image: "/images/images/manFixingCamera.png", position: "center" },
  { image: "/images/images/corporateTableImage.png", position: "center" },
  { image: "/images/icons/support-agent.jpg", position: "center 20%" },
];

const fallback: CustomerStory[] = [
  {
    result: "Still here after launch",
    quote: "The site went live, and Skytech Ghana was still answering the next month.",
    name: "Accord Industrial",
    company: "Website client",
    image: photos[0].image,
    position: photos[0].position,
  },
  {
    result: "A site that takes the booking",
    quote: "Customers can see the offer and take the next step without calling the office first.",
    name: "Atlas Rent-A-Car",
    company: "Accra",
    image: photos[1].image,
    position: photos[1].position,
  },
  {
    result: "Search that keeps working",
    quote: "The launch week was not the finish. The site is still how new clients find us.",
    name: "Kambel Consult",
    company: "Accra",
    image: photos[2].image,
    position: photos[2].position,
  },
  {
    result: "Care for the year",
    quote: "Website, hosting, and the person who answers stayed in one place.",
    name: "Star Pace",
    company: "Website client",
    image: photos[3].image,
    position: photos[3].position,
  },
  {
    result: "Care after the invoice",
    quote: "We were not handed to a stranger once the site was paid for.",
    name: "Bricsky",
    company: "Accra",
    image: photos[4].image,
    position: photos[4].position,
  },
];

function withPhotos(stories: CustomerStory[]) {
  const source = stories.length > 0 ? stories : fallback;
  return source.map((story, index) => ({
    ...story,
    image: story.image || photos[index % photos.length].image,
    position: story.position || photos[index % photos.length].position,
  }));
}

function slot(index: number, active: number, count: number) {
  let delta = index - active;
  if (delta > count / 2) delta -= count;
  if (delta < -count / 2) delta += count;
  return delta;
}

function cardSize(distance: number) {
  if (distance === 0) return { width: 600, height: 300 };
  if (distance === 1) return { width: 78, height: 168 };
  return { width: 64, height: 128 };
}

function leftEdge(delta: number) {
  const gap = 18;
  const widthAt = (distance: number) => cardSize(distance).width;
  if (delta === 0) return -widthAt(0) / 2;
  if (delta > 0) {
    let x = widthAt(0) / 2 + gap;
    for (let step = 1; step < delta; step += 1) x += widthAt(step) + gap;
    return x;
  }
  const distance = Math.abs(delta);
  let x = -widthAt(0) / 2 - gap - widthAt(1);
  for (let step = 2; step <= distance; step += 1) x -= gap + widthAt(step);
  return x;
}

export default function CustomerSay({ stories = [] }: { stories?: CustomerStory[] }) {
  const list = withPhotos(stories);
  const root = useRef<HTMLElement>(null);
  const timer = useRef<gsap.core.Tween | null>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const previous = useRef(0);

  useGSAP(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || paused) return;
    const play = () => {
      timer.current?.kill();
      timer.current = gsap.delayedCall(4.6, () => {
        setIndex((value) => (value + 1) % list.length);
        play();
      });
    };
    play();
    return () => timer.current?.kill();
  }, { scope: root, dependencies: [index, paused, list.length] });

  useGSAP(() => {
    previous.current = index;
  }, { dependencies: [index] });

  return (
    <section id="reviews" ref={root} className="relative px-3 pb-4 md:px-5">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-gradient-to-br from-[#c6ef86] via-[#e7f6c9] to-[#b7dff6] px-4 py-12 md:px-8 md:py-16">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.18em] text-black/45">
          Customer stories
        </p>
        <h2 className="mt-3 text-center font-display text-4xl font-medium tracking-tight text-[#161616] md:text-5xl">
          What customers say.
        </h2>

        <div
          className="relative mt-10 hidden h-[340px] overflow-hidden md:block"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {list.map((story, storyIndex) => {
            const delta = slot(storyIndex, index, list.length);
            const distance = Math.abs(delta);
            const active = delta === 0;
            const size = cardSize(distance);
            const jumped = Math.abs(delta - slot(storyIndex, previous.current, list.length)) > 2;
            return (
              <button
                key={`${story.name}-${storyIndex}`}
                type="button"
                aria-label={story.name}
                onClick={() => setIndex(storyIndex)}
                className="absolute overflow-hidden rounded-[24px] bg-white text-left shadow-[0_16px_40px_rgba(20,20,20,.12)]"
                style={{
                  left: "50%",
                  top: "50%",
                  width: size.width,
                  height: size.height,
                  transform: `translate(${leftEdge(delta)}px, -50%)`,
                  transition: jumped ? "none" : "transform 0.8s cubic-bezier(.45,0,.55,1), width 0.8s cubic-bezier(.45,0,.55,1), height 0.8s cubic-bezier(.45,0,.55,1)",
                  zIndex: 10 - distance,
                }}
              >
                <span className="flex h-full">
                  <span
                    className="flex h-full flex-col justify-center overflow-hidden"
                    style={{
                      width: active ? "48%" : 0,
                      paddingLeft: active ? 28 : 0,
                      paddingRight: active ? 8 : 0,
                      transition: "width 0.8s cubic-bezier(.45,0,.55,1)",
                      animation: active ? "story-in 0.55s ease 0.15s both" : "none",
                    }}
                  >
                      <span className="font-display text-[1.65rem] font-medium leading-tight tracking-tight text-[#161616]">
                        {story.result}
                      </span>
                      <span className="mt-3 text-sm leading-relaxed text-black/65">“{story.quote}”</span>
                      <span className="mt-4 text-sm font-medium text-[#161616]">{story.name}</span>
                      <span className="text-xs text-black/45">{story.company}</span>
                    </span>
                    <span className="relative h-full min-w-0 flex-1">
                      <Image
                        src={story.image || photos[0].image}
                        alt=""
                        fill
                        className="object-cover"
                        style={{ objectPosition: story.position }}
                        sizes="320px"
                      />
                    </span>
                  </span>
              </button>
            );
          })}
        </div>

        <article className="mx-auto mt-8 max-w-md overflow-hidden rounded-[24px] bg-white shadow-[0_16px_40px_rgba(20,20,20,.12)] md:hidden">
          <div className="relative h-52">
            <Image
              src={list[index].image || photos[0].image}
              alt=""
              fill
              className="object-cover"
              style={{ objectPosition: list[index].position }}
              sizes="100vw"
            />
          </div>
          <div className="p-6">
            <p className="font-display text-2xl font-medium leading-tight tracking-tight">{list[index].result}</p>
            <p className="mt-3 text-sm leading-relaxed text-black/65">“{list[index].quote}”</p>
            <p className="mt-4 text-sm font-medium">{list[index].name}</p>
            <p className="text-xs text-black/45">{list[index].company}</p>
          </div>
        </article>

        <div className="mt-6 flex justify-center gap-2">
          {list.map((story, storyIndex) => (
              <button
              key={`${story.name}-${storyIndex}`}
              type="button"
              aria-label={`Show ${story.name}`}
              onClick={() => setIndex(storyIndex)}
              className={`h-1.5 rounded-full transition-all ${storyIndex === index ? "w-6 bg-[#161616]" : "w-1.5 bg-black/25"}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
