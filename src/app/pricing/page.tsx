'use client'

import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const PACKAGES = [
  { variantId: '1968526', credits: 5, price: '900 RSD', checkoutSlug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/68e73d42-0522-438a-af66-9fe04ed00e56' },
  { variantId: '1968516', credits: 10, price: '1500 RSD', checkoutSlug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/2d27b1e0-cdb9-4e6b-83d1-086e5675376e' },
  { variantId: '1968527', credits: 30, price: '3600 RSD', checkoutSlug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/d2944f83-6a7a-4e73-8fce-bcfa0ce474c2' },
]

export default function PricingPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data.user?.id ?? null))
  }, [])

  if (!userId) return <p>Uloguj se da bi kupio kredite.</p>

  return (
    <div style={{ display: 'flex', gap: 20, padding: 40 }}>
      {PACKAGES.map((pkg) => (
        <a
          key={pkg.variantId}
          href={`${pkg.checkoutSlug}?checkout[custom][user_id]=${userId}`}
          target="_blank"
          style={{ border: '1px solid #ccc', padding: 20, borderRadius: 8, textDecoration: 'none', color: '#000' }}
        >
          <h3>{pkg.credits} kredita</h3>
          <p>{pkg.price}</p>
        </a>
      ))}
    </div>
  )
}