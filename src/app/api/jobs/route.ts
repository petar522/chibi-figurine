import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { imagePath, deviceFingerprint } = await request.json()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })
  }

  // 1. Proveri da li je ovaj uređaj već iskoristio besplatni kredit
  if (deviceFingerprint) {
    const { data: existingDevice } = await supabase
      .from('profiles')
      .select('id')
      .eq('device_fingerprint', deviceFingerprint)
      .neq('id', user.id) // Tražimo DRUGOG korisnika sa istim uređajem
      .maybeSingle()

    // Ako je uređaj već viđen kod drugog korisnika, blokiramo ga!
    if (existingDevice) {
      return NextResponse.json({ error: 'DEVICE_BLOCKED' }, { status: 403 })
    }
  }

  // 2. Ako je sve uredu, oduzmi kredit i započni job
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

  // 3. Zabeleži uređaj korisniku (ako prvi put koristi sajt)
  if (deviceFingerprint) {
    await supabase
      .from('profiles')
      .update({ device_fingerprint: deviceFingerprint })
      .eq('id', user.id)
  }

  return NextResponse.json({ jobId: data })
}