'use client'

import { useState } from 'react'

const plans = [
  {
    name: 'Basic Website Package',
    audience: 'Startups & Small Businesses',
    timeline: '1 week',
    features: [
      '5-6 Page Responsive site',
      'Home, About, Service, Contact',
      'Google indexing',
      '5-6 Whats App integration',
      'Google map & Social links',
      '1yr SSL + Domain + Hosting',
      'Responsive interface',
      'Admin dashboard',
    ],
    price: {
      "USD": "500",
      "GHC": "2,500"
    },
    renewal: 'Renews only at Ghc 1,000/yr\nFree regular maintenance\nNo hidden fees',
    recommended: false,
  },
  {
    name: 'Basic Website Package',
    audience: 'Startups & Small Businesses',
    timeline: '1 week',
    features: [
      'Everything in basic',
      'Advanced SEO',
      'Custom contact forms',
      'Live chat system',
      'Testimonials, Portfolio, Gallery',
      'Blog with admin access (CMS)',
      'Analytics dashboard',
    ],
    price: {
      "USD": "750",
      "GHC": "6,500"
    },
    renewal: 'Renews only at Ghc 1,000/yr\nFree regular maintenance\nNo hidden fees',
    recommended: true,
  },
  {
    name: 'Basic Website Package',
    audience: 'Startups & Small Businesses',
    timeline: '1 week',
    features: [
      '5-6 Page Responsive site',
      'Home, About, Service, Contact',
      'Google indexing',
      '5-6 Whats App integration',
      'Google map & Social links',
      '1yr SSL+Domain+Hosting',
      'Responsive interface',
      'Admin dashboard',
    ],
    price: {
      "USD": "500",
      "GHC": "2,500"
    },
    renewal: 'Renews only at Ghc 1,000/yr\nFree regular maintenance\nNo hidden fees',
    recommended: false,
  },
]

export default function PricingCards({ currency }: { currency: "GHC" | "USD" }) {
  const defaultIndex = plans.findIndex((p) => p.recommended)
  const [selected, setSelected] = useState(defaultIndex)

  return (
    <div className="flex flex-col items-stretch justify-center gap-4 max-md:gap-17.5 mb-10 px-4 md:flex-row md:px-0">
      {plans.map((plan, index) => {
        const isSelected = selected === index
        const isRecommended = plan.recommended

        return (
          <div
            key={index}
            onClick={() => setSelected(index)}
            className={`
              relative flex flex-col justify-between
              rounded-3xl px-4 pt-8 pb-5 cursor-pointer
              transition-all duration-300 min-w-75
              ${isSelected
                ? 'bg-[#1E5AC8] text-white scale-105'
                : 'border border-gray-400'
              }
            `}
          >
            {isRecommended && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className={`
                  font-medium uppercase
                  px-4 py-3 rounded-2xl border
                  ${isSelected
                    ? 'bg-white text-gray-800 border-[#1E5AC8]'
                    : 'bg-white text-gray-700 border-gray-400'
                  }
                `}>
                  Recommended
                </span>
              </div>
            )}

            <div>
              <h3 className={`text-xl font-bold mb-3 ${isSelected ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>

              <div className={`border-l-4 pl-3 mb-5 ${isSelected ? 'border-white' : 'border-[#1E5AC8]'}`}>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  {plan.audience}
                </p>
                <p className={`text-sm ${isSelected ? 'text-white/90' : 'text-gray-600'}`}>
                  Timeline:{' '}
                  <span className={isSelected ? 'text-white font-medium' : 'text-[#1E5AC8] font-medium'}>
                    {plan.timeline}
                  </span>
                </p>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className={`mt-0.5 ${isSelected ? 'text-white' : 'text-gray-500'}`}>✓</span>
                    <span className={isSelected ? 'text-white/90' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className='relative'>
              <div className={`mb-4`} />
              <span className={`text-xs absolute right-1 top-2 ${isSelected ? 'text-white' : 'text-[#1E5AC8]'}`}>
                  {currency}
                </span>
              <div className="flex items-center justify-end gap-3 mb-2">
                <div className={`flex-1 h-px ${isSelected ? 'bg-white/40' : 'bg-[#1E5AC8]'}`} />
                <span className={`text-5xl font-black ${isSelected ? 'text-white' : 'text-[#1E5AC8]'}`}>
                  {plan.price[currency]}
                </span>
              </div>
              <p className={`text-xs text-right leading-5 whitespace-pre-line ${isSelected ? 'text-white/80' : 'text-gray-500'}`}>
                {plan.renewal}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}