import { createClient } from '@/lib/supabase/server'
import { fal, HUNYUAN_ENDPOINT } from '@/lib/fal'
import { NextResponse } from 'next/server'

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single()

  if (jobError || !job || !job.illustration_url) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  try {
    const { data: blob, error: dlError } = await supabase.storage
      .from('job-files')
      .download(job.illustration_url)

    if (dlError || !blob) throw new Error('Could not read illustration')

    const buffer = Buffer.from(await blob.arrayBuffer())
    const dataUri = `data:image/png;base64,${buffer.toString('base64')}`

    const { request_id } = await fal.queue.submit(HUNYUAN_ENDPOINT, {
      input: {
        input_image_url: dataUri,
        generate_type: 'Normal',
      },
    })

    await supabase
      .from('jobs')
      .update({ status: 'model_generating', fal_request_id: request_id })
      .eq('id', jobId)

    return NextResponse.json({ requestId: request_id })
  } catch (err) {
    await supabase
      .from('jobs')
      .update({ status: 'failed', error_message: err instanceof Error ? err.message : 'fal.ai submit failed' })
      .eq('id', jobId)
    return NextResponse.json({ error: 'SUBMIT_FAILED' }, { status: 500 })
  }
}