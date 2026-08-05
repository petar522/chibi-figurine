import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'
import { NextResponse } from 'next/server'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const rawBody = await request.text()
  const signature = request.headers.get('creem-signature') ?? '' // Creem koristi creem-signature header

  // Provera potpisa (Security)
  const hmac = crypto.createHmac('sha256', process.env.CREEM_WEBHOOK_SECRET!)
  const digest = hmac.update(rawBody).digest('hex')

  if (digest !== signature) {
    return NextResponse.json({ error: 'INVALID_SIGNATURE' }, { status: 401 })
  }

  const payload = JSON.parse(rawBody)

  // Creem šalje event 'checkout.session.completed' kada je uplata uspešna
  if (payload.event_type === 'checkout.session.completed') {
    const metadata = payload.data.object.metadata
    const userId = metadata?.user_id
    const credits = parseInt(metadata?.credits, 10)
    const orderId = payload.data.object.id // ID transakcije

    if (!userId || !credits) {
      return NextResponse.json({ error: 'MISSING_METADATA' }, { status: 400 })
    }

    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('id, credits, processed_order_ids')
      .eq('id', userId)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 })
    }

    // Sprečavamo duplo dodavanje kredita ako Creem pošalje webhook dva puta
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

  return NextResponse.json({ received: true })
}