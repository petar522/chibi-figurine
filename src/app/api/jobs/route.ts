import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { imagePath } = await request.json()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })
  }

  // 1. Pročitaj IP adresu korisnika (Render šalje u x-forwarded-for headeru)
  const forwarded = request.headers.get('x-forwarded-for')
  const userIp = forwarded ? forwarded.split(',')[0] : 'unknown'

  // 2. Proveri da li je ovaj IP već iskoristio besplatni kredit
  if (userIp !== 'unknown') {
    const { data: existingIp } = await supabase
      .from('profiles')
      .select('id')
      .eq('signup_ip', userIp)
      .neq('id', user.id)
      .maybeSingle()

    // Ako je IP već viđen kod drugog korisnika, blokiramo ga!
    if (existingIp) {
      return NextResponse.json({ error: 'DEVICE_BLOCKED' }, { status: 403 })
    }
  }

  // 3. Ako je sve uredu, oduzmi kredit i započni job
  const { data, error } = await supabase.rpc('create_job_with_credit', {
    p_user_id: user.id,
    p_original_image_url: imagePath,
  })

  if (error) {
    if (error.message.includes('INSUFFICIENT_CREDITS')) {
      return NextResponse.json({ error: 'INSUFFICIENT_CREDITS' }, { status: 402 })
    }
    return NextResponse.json({ error: 'UNKNOWN' }, { status: 500 })
  }

  // 4. Zabeleži IP adresu korisniku
  if (userIp !== 'unknown') {
    await supabase
      .from('profiles')
      .update({ signup_ip: userIp })
      .eq('id', user.id)
      .is('signup_ip', null) // Upisuje samo ako već nije zabeležen
  }

  return NextResponse.json({ jobId: data })
}