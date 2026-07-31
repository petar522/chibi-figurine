'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

const PACKAGES = [
  { 
    variantId: '1968526', 
    credits: 5, 
    price: '$5', 
    name: 'Starter',
    desc: 'Perfect for trying out more styles.',
    checkoutSlug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/68e73d42-0522-438a-af66-9fe04ed00e56',
    highlight: false
  },
  { 
    variantId: '1968516', 
    credits: 10, 
    price: '$9', 
    name: 'Creator',
    desc: 'Best value for regular creators.',
    checkoutSlug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/2d27b1e0-cdb9-4e6b-83d1-086e5675376e',
    highlight: true
  },
  { 
    variantId: '1968527', 
    credits: 30, 
    price: '$20', 
    name: 'Studio',
    desc: 'For power users and businesses.',
    checkoutSlug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/d2944f83-6a7a-4e73-8fce-bcfa0ce474c2',
    highlight: false
  },
]

export default function PricingPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-heading text-2xl font-extrabold text-slate-900">
            Chibi<span className="text-purple-600">3D</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-extrabold text-slate-900 mb-3">
            Choose your credit pack
          </h1>
          <p className="text-slate-600">No subscriptions. Buy credits only when you need them.</p>
        </div>

        {!userId ? (
          <div className="text-center bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-8">
            You need to be logged in to buy credits. <Link href="/login" className="font-bold underline">Sign in here</Link>.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {PACKAGES.map((pkg) => (
              <div 
                key={pkg.variantId} 
                className={`bg-white p-8 rounded-3xl shadow-md flex flex-col relative ${
                  pkg.highlight ? 'border-2 border-purple-600 scale-105 shadow-xl' : 'border border-slate-100'
                }`}
              >
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <h3 className="font-heading text-xl font-bold mb-2 text-slate-900">{pkg.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{pkg.desc}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-extrabold text-slate-900">{pkg.price}</span>
                  <span className="text-slate-400 ml-2">/ {pkg.credits} credits</span>
                </div>

                <ul className="space-y-3 mb-8 text-slate-600 flex-grow">
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> {pkg.credits} 3D Generations</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> High-Quality STL & GLB</li>
                  <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Commercial Use</li>
                </ul>

                <a
                  href={`${pkg.checkoutSlug}?checkout[custom][user_id]=${userId}`}
                  target="_blank"
                  className={`block text-center font-bold py-3 rounded-xl transition-colors ${
                    pkg.highlight 
                      ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/30' 
                      : 'bg-slate-900 hover:bg-slate-800 text-white'
                  }`}
                >
                  Buy {pkg.name} Pack
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}