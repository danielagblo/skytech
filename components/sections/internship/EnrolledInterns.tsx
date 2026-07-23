'use client'

import { useRef, useEffect } from 'react'
import Image, { StaticImageData } from 'next/image'

import internPlaceholder from '@/assets/images/intern-x.png'

// replace with real intern data later
const interns = [
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
  { name: 'Hillary Krimson', university: 'University of Ghana', cohort: 'Skytech Ghana Intern 2026', image: internPlaceholder },
]

const doubled = [...interns, ...interns]

const ROW_CONFIGS = [
  { speed: 0.35, reverse: false, cardSize: 'large' },
  { speed: 0.28, reverse: true,  cardSize: 'medium' },
  { speed: 0.40, reverse: false, cardSize: 'large' },
  { speed: 0.32, reverse: true,  cardSize: 'small' },
] as const

type CardSize = 'large' | 'medium' | 'small'

function InternCard({
  name,
  university,
  cohort,
  image,
  size,
}: {
  name: string
  university: string
  cohort: string
  image: StaticImageData
  size: CardSize
}) {
  const sizeMap: Record<CardSize, { card: string; avatar: string; name: string; sub: string }> = {
    large:  { card: 'w-80 h-28',  avatar: 'w-20 h-20', name: 'text-xl',  sub: 'text-xs' },
    medium: { card: 'w-64 h-24',  avatar: 'w-16 h-16', name: 'text-lg',  sub: 'text-xs' },
    small:  { card: 'w-52 h-20',  avatar: 'w-14 h-14', name: 'text-base', sub: 'text-xs' },
  }

  const s = sizeMap[size]

  return (
    <div className={`shrink-0 ${s.card} bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-4 px-4`}>
      <div className={`${s.avatar} rounded-full overflow-hidden shrink-0 bg-gray-200`}>
        <Image
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // fallback to initials if image missing
            e.currentTarget.style.display = 'none'
          }}
        />
      </div>
      <div className="min-w-0">
        <p className={`${s.name} font-bold text-gray-900 truncate`}>{name}</p>
        <p className={`${s.sub} text-gray-500 truncate`}>{university}</p>
        <p className={`${s.sub} text-gray-400 truncate`}>{cohort}</p>
      </div>
    </div>
  )
}

function ScrollRow({
  items,
  speed,
  reverse,
  cardSize,
}: {
  items: typeof doubled
  speed: number
  reverse: boolean
  cardSize: CardSize
}) {
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const rafRef = useRef<number>(0)
  const isPausedRef = useRef(false)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const startScroll = useRef(0)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    const animate = () => {
      if (!isPausedRef.current) {
        posRef.current += reverse ? -speed : speed
        const half = track.scrollWidth / 2
        if (posRef.current >= half) posRef.current = 0
        if (posRef.current < 0) posRef.current = half
        track.style.transform = `translateX(${-posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [speed, reverse])

  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    isPausedRef.current = true
    startX.current = e.clientX
    startScroll.current = posRef.current
  }
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    posRef.current = startScroll.current + (startX.current - e.clientX)
  }
  const onMouseUp = () => { isDragging.current = false; isPausedRef.current = false }

  const onTouchStart = (e: React.TouchEvent) => {
    isPausedRef.current = true
    startX.current = e.touches[0].clientX
    startScroll.current = posRef.current
  }
  const onTouchMove = (e: React.TouchEvent) => {
    posRef.current = startScroll.current + (startX.current - e.touches[0].clientX)
  }
  const onTouchEnd = () => { isPausedRef.current = false }

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing"
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div
        ref={trackRef}
        className="flex flex-row gap-3 w-max will-change-transform"
        style={{ userSelect: 'none' }}
      >
        {items.map((intern, i) => (
          <InternCard key={i} {...intern} size={cardSize} />
        ))}
      </div>
    </div>
  )
}

export default function EnrolledInterns() {
  return (
    <section className="py-10 overflow-hidden bg-white">
      {/* header */}
      <div className="flex flex-col items-start gap-4 px-6 mb-8 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-3 md:gap-4">
          <span className="text-lg font-medium text-gray-800 md:text-2xl">Enrolled interns</span>
          {/* decorative progress bar */}
          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden md:w-48">
            <div className="h-full w-1/3 bg-blue-500 rounded-full" />
          </div>
        </div>
        <span className="text-3xl font-semibold text-gray-900 md:text-5xl">439+</span>
      </div>

      {/* rows */}
      <div className="flex flex-col gap-3">
        {ROW_CONFIGS.map((config, i) => (
          <ScrollRow key={i} items={doubled} {...config} />
        ))}
      </div>
    </section>
  )
}