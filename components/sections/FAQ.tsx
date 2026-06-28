'use client'

import { useState, useRef, useEffect } from 'react'

const faqs: Record<string, { question: string; answer: string }[]> = {
  Hosting: [
    { question: 'How Long does my hosting last', answer: 'Your hosting package lasts for 1 year and renews at GH₵1,000/yr.' },
    { question: 'Does hosting include pass', answer: 'Yes, hosting includes SSL and domain management.' },
    { question: 'Frequently Asked Questions', answer: 'You can find all FAQs in this section categorised by topic.' },
    { question: 'How Long does my hosting last', answer: 'Your hosting package lasts for 1 year and renews at GH₵1,000/yr.' },
    { question: 'Does hosting include pass', answer: 'Yes, hosting includes SSL and domain management.' },
    { question: 'Frequently Asked Questions', answer: 'You can find all FAQs in this section categorised by topic.' },
  ],
  Domain: [
    { question: 'How do I register a domain?', answer: 'We handle domain registration as part of your package.' },
    { question: 'Can I transfer my existing domain?', answer: 'Yes, domain transfers are supported. Contact us to initiate.' },
  ],
  Maintenance: [
    { question: 'What does maintenance include?', answer: 'Regular updates, bug fixes, and content changes are covered.' },
    { question: 'How often is maintenance done?', answer: 'Maintenance is performed monthly or on demand.' },
  ],
  Payment: [
    { question: 'What payment methods are accepted?', answer: 'We accept Mobile Money, bank transfer, and cash.' },
    { question: 'Is there a payment plan?', answer: 'Yes, installment plans are available on request.' },
  ],
}

const categories = Object.keys(faqs);
const CARD_HEIGHT = 410;

function ScrollPill({ scrollRatio, thumbRatio }: { scrollRatio: number; thumbRatio: number }) {
  const trackHeight = CARD_HEIGHT - 80
  const thumbH = Math.max(thumbRatio * trackHeight, 32)
  const maxTop = trackHeight - thumbH
  const top = scrollRatio * maxTop

  return (
    <div
      className="w-2.5 rounded-full bg-white relative shrink-0 scale-y-80 flex justify-center"
      style={{ height: trackHeight }}
    >
      <div
        className="w-2 rounded-full bg-[#817e7e] absolute transition-all duration-150"
        style={{ height: thumbH, top }}
      />
    </div>
  )
}

export default function FAQSection() {
  const [activeCategory, setActiveCategory] = useState(categories[0])
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)
  const [leftScroll, setLeftScroll] = useState({ ratio: 0, thumb: 1 })
  const [rightScroll, setRightScroll] = useState({ ratio: 0, thumb: 1 })

  function calcScrollState(el: HTMLDivElement) {
    const scrollable = el.scrollHeight - el.clientHeight
    const ratio = scrollable > 0 ? el.scrollTop / scrollable : 0
    const thumb = scrollable > 0 ? el.clientHeight / el.scrollHeight : 1
    return { ratio, thumb }
  }

  useEffect(() => {
    const el = leftRef.current
    if (!el) return
    const update = () => setLeftScroll(calcScrollState(el))
    update()
    el.addEventListener('scroll', update)
    return () => el.removeEventListener('scroll', update)
  }, [])

  useEffect(() => {
    const el = rightRef.current
    if (!el) return
    const update = () => setRightScroll(calcScrollState(el))
    update()
    el.addEventListener('scroll', update)
    return () => el.removeEventListener('scroll', update)
  }, [activeCategory, openIndex])

  const handleCategory = (cat: string) => {
    setActiveCategory(cat)
    setOpenIndex(null)
    if (rightRef.current) rightRef.current.scrollTop = 0
    setRightScroll({ ratio: 0, thumb: 1 })
  }

  return (
    <section className="py-16">
      <h1 className="text-5xl mb-1">FAQs</h1>
      <p className="mb-8">Frequently Asked Questions</p>

      <div
        className="rounded-3xl py-6 px-3 flex flex-row bg-[#f9f9f9] overflow-hidden"
        style={{ height: CARD_HEIGHT }}
      >
        <div className="flex flex-row gap-2 pr-6 shrink-0 self-stretch">
          <div className="flex flex-col shrink-0 pr-5">
            <ScrollPill scrollRatio={leftScroll.ratio} thumbRatio={leftScroll.thumb} />
          </div>

          <div className="flex flex-col min-w-40 self-stretch">
            <p className="mb-3 pl-2 shrink-0">Question Areas</p>
            <div
              ref={leftRef}
              className="flex flex-col overflow-y-auto flex-1 no-scrollbar"
            >
              {categories.map((cat) => {
                const isActive = cat === activeCategory
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`flex items-center justify-between gap-6 pl-4 pr-6 py-3 rounded-lg text-left w-50 transition-all duration-200
                      ${isActive
                        ? 'text-gray-900 font-semibold bg-white'
                        : 'text-gray-500 hover:text-gray-600'
                      }`}
                  >
                    <span className="text-xl">{cat}</span>
                    <span className={`text-lg transition-opacity ${isActive ? 'opacity-100' : 'opacity-40'}`}>&#10132;</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-2 flex-1 pl-4 self-stretch min-w-0">
          <div
            ref={rightRef}
            className="flex-1 flex flex-col overflow-y-auto overflow-x-hidden no-scrollbar"
          >
            {faqs[activeCategory].map((faq, index) => {
              const isOpen = openIndex === index
              return (
                <div key={index} className="border-b border-gray-400 last:border-0 min-w-0">
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-3 text-left gap-4 min-w-0"
                  >
                    <span className={`text-xl transition-all min-w-0 break-words ${isOpen ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                      {faq.question}
                    </span>
                    <span className={`text-3xl text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-45' : ''}`}>
                      &#10010;
                    </span>
                  </button>
                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40 pb-4' : 'max-h-0'}`}>
                    <p className="text-gray-600 leading-relaxed pr-4">{faq.answer}</p>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="flex flex-col shrink-0 pl-6">
            <ScrollPill scrollRatio={rightScroll.ratio} thumbRatio={rightScroll.thumb} />
          </div>
        </div>
      </div>
    </section>
  )
}