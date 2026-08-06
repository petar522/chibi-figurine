import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

// mapiraj tvoje Lemon Squeezy variant ID-jeve na broj kredita
const VARIANT_CREDITS: Record<string, number> = {
  '1988795': 5,
  '1988790': 10,
  '1988793': 30,
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // service role, ne anon key — mora da zaobiđe RLS
)

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('x-signature') ?? ''

  const hmac = crypto.createHmac('sha256', process.env.LEMONSQUEEZY_WEBHOOK_SECRET!)
  const digest = hmac.update(rawBody).digest('hex')

  if (digest !== signature) {
    return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)
  const eventName = payload.meta.event_name

if (eventName === 'order_created') {
  const orderId = String(payload.data.id)
  const variantId = String(payload.data.attributes.first_order_item.variant_id)
  const userId = payload.meta.custom_data?.user_id

  const credits = VARIANT_CREDITS[variantId]
  if (!credits) {
    return NextResponse.json({ error: 'UNKNOWN_VARIANT' }, { status: 400 })
  }
  if (!userId) {
    return NextResponse.json({ error: 'MISSING_USER_ID' }, { status: 400 })
  }

  const { data: profile } = await supabaseAdmin
    .from('profiles')
    .select('id, credits, processed_order_ids')
    .eq('id', userId)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 })
  }

  if (profile.processed_order_ids?.includes(orderId)) {
    return NextResponse.json({ status: 'already_processed' })
  }

  await supabaseAdmin
    .from('profiles')
    .update({
      credits: profile.credits + credits,
      processed_order_ids: [...(profile.processed_order_ids ?? []), orderId],
    })
    .eq('id', profile.id)
}

  if (eventName === 'order_refunded') {
    // opciono: oduzmi kredite nazad — zavisi da li želiš da dozvoliš da ostanu ako su već iskorišćeni
  }

  return NextResponse.json({ received: true })
}