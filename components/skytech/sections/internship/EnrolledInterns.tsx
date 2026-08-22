"use client";

import { useRef, useEffect, useState } from "react";
import Image from "next/image";

export interface EnrolledIntern {
  name: string;
  university: string;
  cohort: string;
  image?: string;
}

const ROW_CONFIGS = [
  { speed: 0.35, reverse: false, cardSize: "large" },
  { speed: 0.28, reverse: true, cardSize: "medium" },
  { speed: 0.4, reverse: false, cardSize: "large" },
  { speed: 0.32, reverse: true, cardSize: "small" },
] as const;

type CardSize = "large" | "medium" | "small";

const SIZE_MAP: Record<CardSize, { card: string; avatar: string; name: string; sub: string }> = {
  large: {
    card: "w-[17.5rem] sm:w-72 md:w-80 h-24 sm:h-28",
    avatar: "w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20",
    name: "text-base sm:text-lg md:text-xl",
    sub: "text-[10px] sm:text-xs",
  },
  medium: {
    card: "w-[15rem] sm:w-60 md:w-64 h-20 sm:h-24",
    avatar: "w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16",
    name: "text-sm sm:text-base md:text-lg",
    sub: "text-[10px] sm:text-xs",
  },
  small: {
    card: "w-[13rem] sm:w-48 md:w-52 h-[4.5rem] sm:h-20",
    avatar: "w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14",
    name: "text-sm sm:text-base",
    sub: "text-[10px] sm:text-xs",
  },
};

function InternCard({
  name,
  university,
  cohort,
  image,
  size,
}: {
  name: string;
  university: string;
  cohort: string;
  image: string;
  size: CardSize;
}) {
  const s = SIZE_MAP[size];

  return (
    <div
      className={`shrink-0 ${s.card} bg-gray-50 rounded-none border border-gray-200 flex items-center gap-3 px-3 sm:gap-4 sm:px-4`}
    >
      <div className={`${s.avatar} rounded-full overflow-hidden shrink-0 bg-gray-200`}>
        <Image
          src={image}
          alt={name}
          width={80}
          height={80}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>
      <div className="min-w-0">
        <p className={`${s.name} font-bold text-gray-900 truncate`}>{name}</p>
        <p className={`${s.sub} text-gray-500 truncate`}>{university}</p>
        <p className={`${s.sub} text-gray-400 truncate`}>{cohort}</p>
      </div>
    </div>
  );
}

function ScrollRow({
  items,
  speed,
  reverse,
  cardSize,
}: {
  items: EnrolledIntern[];
  speed: number;
  reverse: boolean;
  cardSize: CardSize;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(0);
  const rafRef = useRef<number>(0);
  const isPausedRef = useRef(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startScroll = useRef(0);
  const [repeat, setRepeat] = useState(2);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track || items.length === 0) return;

    const measure = () => {
      const outerWidth = outer.clientWidth;
      const cardWidth = track.scrollWidth / repeat;
      if (cardWidth <= 0) return;

      // If the unique items cannot fill the screen width, we do NOT repeat them
      // This ensures a single intern doesn't show multiple times at once.
      if (cardWidth < outerWidth) {
        setRepeat(1);
        if (posRef.current === 0) {
          posRef.current = reverse ? -cardWidth : outerWidth;
        }
      } else {
        const needed = Math.max(2, 2 * Math.ceil(outerWidth / cardWidth));
        if (needed !== repeat) setRepeat(needed);
      }
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [repeat, items.length, reverse]);

  useEffect(() => {
    const track = trackRef.current;
    const outer = outerRef.current;
    if (!track || !outer) return;

    const animate = () => {
      if (!isPausedRef.current) {
        const outerWidth = outer.clientWidth;
        const trackWidth = track.scrollWidth / (repeat > 1 ? repeat : 1);

        if (repeat === 1) {
          // Single-item or low-item count: scroll across the full screen width without repeating on screen
          if (reverse) {
            posRef.current += speed;
            if (posRef.current > outerWidth) {
              posRef.current = -trackWidth;
            }
          } else {
            posRef.current -= speed;
            if (posRef.current < -trackWidth) {
              posRef.current = outerWidth;
            }
          }
          track.style.transform = `translateX(${posRef.current}px)`;
        } else {
          // Standard infinite scrolling loop
          posRef.current += reverse ? -speed : speed;
          const half = track.scrollWidth / 2;
          if (posRef.current >= half) posRef.current = 0;
          if (posRef.current < 0) posRef.current = half;
          track.style.transform = `translateX(${-posRef.current}px)`;
        }
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, reverse, repeat]);

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    isPausedRef.current = true;
    startX.current = e.clientX;
    startScroll.current = posRef.current;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    posRef.current = startScroll.current + (startX.current - e.clientX);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    isPausedRef.current = false;
  };

  const onTouchStart = (e: React.TouchEvent) => {
    isPausedRef.current = true;
    startX.current = e.touches[0].clientX;
    startScroll.current = posRef.current;
  };
  const onTouchMove = (e: React.TouchEvent) => {
    posRef.current = startScroll.current + (startX.current - e.touches[0].clientX);
  };
  const onTouchEnd = () => {
    isPausedRef.current = false;
  };

  const repeated = Array.from({ length: repeat }).flatMap(() => items);

  return (
    <div
      ref={outerRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing touch-pan-x"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={trackRef} className="flex flex-row gap-3 w-max will-change-transform" style={{ userSelect: "none" }}>
        {repeated.map((intern, i) => (
          <InternCard
            key={i}
            {...intern}
            image={intern.image || " "}
            size={cardSize}
          />
        ))}
      </div>
    </div>
  );
}

export default function EnrolledInterns({ interns }: { interns: EnrolledIntern[] }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!interns || interns.length === 0) return null;

  const maxRows = isMobile ? 2 : ROW_CONFIGS.length;
  const activeRowsCount = Math.min(maxRows, interns.length);
  const activeConfigs = ROW_CONFIGS.slice(0, activeRowsCount);

  return (
    <section className="overflow-hidden bg-white py-8 sm:py-10">
      <div className="mb-6 flex flex-col items-start gap-3 px-4 sm:mb-8 sm:gap-4 sm:px-6 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex w-full items-center gap-3 sm:gap-4 md:w-auto">
          <span className="text-base font-medium text-gray-800 sm:text-lg md:text-2xl">Enrolled interns</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-200 sm:w-48 sm:flex-none md:w-48">
            <div className="h-full w-1/3 rounded-full bg-slate-950" />
          </div>
        </div>
        <span className="text-2xl font-semibold text-gray-900 sm:text-3xl md:text-5xl">{interns.length}</span>
      </div>

      <div className="flex flex-col gap-2 sm:gap-3">
        {activeConfigs.map((config, i) => (
          <ScrollRow key={i} items={interns} {...config} />
        ))}
      </div>
    </section>
  );
}
