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
  large: { card: "w-80 h-28", avatar: "w-20 h-20", name: "text-xl", sub: "text-xs" },
  medium: { card: "w-64 h-24", avatar: "w-16 h-16", name: "text-lg", sub: "text-xs" },
  small: { card: "w-52 h-20", avatar: "w-14 h-14", name: "text-base", sub: "text-xs" },
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
                className={`shrink-0 ${s.card} bg-gray-50 rounded-none border border-gray-200 flex items-center gap-4 px-4`}
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
      const setWidth = track.scrollWidth / repeat;
      if (setWidth <= 0) return;
      const needed = Math.max(2, 2 * Math.ceil(outerWidth / setWidth));
      if (needed !== repeat) setRepeat(needed);
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(outer);
    return () => observer.disconnect();
  }, [repeat, items.length]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const animate = () => {
      if (!isPausedRef.current) {
        posRef.current += reverse ? -speed : speed;
        const half = track.scrollWidth / 2;
        if (posRef.current >= half) posRef.current = 0;
        if (posRef.current < 0) posRef.current = half;
        track.style.transform = `translateX(${-posRef.current}px)`;
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [speed, reverse]);

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
      className="overflow-hidden cursor-grab active:cursor-grabbing"
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
            image={intern.image || "/images/images/intern-x.png"}
            size={cardSize}
          />
        ))}
      </div>
    </div>
  );
}

export default function EnrolledInterns({ interns }: { interns: EnrolledIntern[] }) {
  if (!interns || interns.length === 0) return null;

  return (
    <section className="py-10 overflow-hidden bg-white">
      <div className="flex flex-col items-start gap-4 px-6 mb-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-lg font-medium text-gray-800 md:text-2xl">Enrolled interns</span>
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden md:w-48">
            <div className="h-full w-1/3 bg-slate-950 rounded-full" />
          </div>
        </div>
        <span className="text-3xl font-semibold text-gray-900 md:text-5xl">{interns.length}+</span>
      </div>

      <div className="flex flex-col gap-3">
        {ROW_CONFIGS.map((config, i) => (
          <ScrollRow key={i} items={interns} {...config} />
        ))}
      </div>
    </section>
  );
}
