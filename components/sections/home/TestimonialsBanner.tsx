'use client'

import { useRef, useEffect } from 'react'

const testimonials = [
  {
    quote: "I'm working with Skytech Ghana. They have made several projects. I'm deeply impressed about the outcome.",
    name: 'Elon Musk',
    title: 'CEO: Space X LIMITED',
  },
  {
    quote: "I'm working with Skytech Ghana. They have made several projects. I'm deeply impressed about the outcome.",
    name: 'Elon Musk',
    title: 'CEO: Space X LIMITED',
  },
  {
    quote: "I'm working with Skytech Ghana. They have made several projects. I'm deeply impressed about the outcome.",
    name: 'Elon Musk',
    title: 'CEO: Space X LIMITED',
  },
  {
    quote: "I'm working with Skytech Ghana. They have made several projects. I'm deeply impressed about the outcome.",
    name: 'Elon Musk',
    title: 'CEO: Space X LIMITED',
  },
  {
    quote: "I'm working with Skytech Ghana. They have made several projects. I'm deeply impressed about the outcome.",
    name: 'Elon Musk',
    title: 'CEO: Space X LIMITED',
  },
  {
    quote: "I'm working with Skytech Ghana. They have made several projects. I'm deeply impressed about the outcome.",
    name: 'Elon Musk',
    title: 'CEO: Space X LIMITED',
  },
]

const doubled = [...testimonials, ...testimonials]

const rows = doubled.reduce<(typeof doubled)[]>((acc, item, i) => {
  const rowIndex = Math.floor(i / (doubled.length / 2)) % 2
  if (!acc[rowIndex]) acc[rowIndex] = []
  acc[rowIndex].push(item)
  return acc
}, [])

function TestimonialCard({ quote, name, title }: { quote: string; name: string; title: string }) {
  return (
    <div className="shrink-0 w-80 border border-gray-500 rounded-2xl p-6 flex flex-col justify-between gap-4 bg-[#f9f9f9]">
      <p className="text-gray-800 text-base leading-relaxed">{quote}</p>
      <div className="text-center">
        <p className="text-xl font-bold font-serif">-{name}</p>
        <p className="text-xs text-gray-500 uppercase tracking-wide">{title}</p>
      </div>
    </div>
  )
}

function ScrollRow({ items, speed = 0.4, reverse = false }: {
  items: typeof doubled
  speed?: number
  reverse?: boolean
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

  // mouse drag
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    isPausedRef.current = true
    startX.current = e.clientX
    startScroll.current = posRef.current
  }

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    const delta = startX.current - e.clientX
    posRef.current = startScroll.current + delta
  }

  const onMouseUp = () => {
    isDragging.current = false
    isPausedRef.current = false
  }

  // touch swipe
  const onTouchStart = (e: React.TouchEvent) => {
    isPausedRef.current = true
    startX.current = e.touches[0].clientX
    startScroll.current = posRef.current
  }

  const onTouchMove = (e: React.TouchEvent) => {
    const delta = startX.current - e.touches[0].clientX
    posRef.current = startScroll.current + delta
  }

  const onTouchEnd = () => {
    isPausedRef.current = false
  }

  return (
    <div
      className=" cursor-grab active:cursor-grabbing"
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
        className="flex flex-row gap-4 w-max will-change-transform"
        style={{ userSelect: 'none' }}
      >
        {items.map((t, i) => (
          <TestimonialCard key={i} {...t} />
        ))}
      </div>
    </div>
  )
}

export default function TestimonialsBanner() {
  return (
    <section className="py-16 overflow-hidden bg-white">
      <h2 className="text-center text-5xl uppercase tracking-tight mb-12">
        What Our Partners Say
      </h2>
      <div className="flex flex-col gap-4">
        <ScrollRow items={doubled} speed={0.4} />
        <ScrollRow items={doubled} speed={0.4} reverse />
      </div>
    </section>
  )
}