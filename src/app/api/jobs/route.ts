import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { imagePath } = await request.json()
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })
  }

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

  return NextResponse.json({ jobId: data })
}