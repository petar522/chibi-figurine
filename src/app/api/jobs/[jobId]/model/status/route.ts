import { createClient } from '@/lib/supabase/server'
import { fal, HUNYUAN_ENDPOINT } from '@/lib/fal'
import { NextResponse } from 'next/server'

export async function GET(
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

  if (jobError || !job || !job.fal_request_id) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
  }

  if (job.status === 'model_ready' || job.status === 'failed') {
    return NextResponse.json({ status: job.status })
  }

  const queueStatus = await fal.queue.status(HUNYUAN_ENDPOINT, {
    requestId: job.fal_request_id,
    logs: false,
  })

  if (queueStatus.status === 'COMPLETED') {
    try {
      const result = await fal.queue.result(HUNYUAN_ENDPOINT, {
        requestId: job.fal_request_id,
      })

      const glbUrl = (result.data as { model_glb: { url: string } }).model_glb.url
      const glbRes = await fetch(glbUrl)
      const glbBuffer = Buffer.from(await glbRes.arrayBuffer())

      const rawModelPath = job.illustration_url.replace(/illustration\.\w+$/, 'raw-model.glb')

      const { error: uploadError } = await supabase.storage
        .from('job-files')
        .upload(rawModelPath, glbBuffer, { contentType: 'model/gltf-binary' })

      if (uploadError) throw uploadError

      await supabase
        .from('jobs')
        .update({ status: 'model_ready', raw_model_url: rawModelPath })
        .eq('id', jobId)

      return NextResponse.json({ status: 'model_ready' })
    } catch (err) {
      await supabase
        .from('jobs')
        .update({ status: 'failed', error_message: err instanceof Error ? err.message : 'Model fetch failed' })
        .eq('id', jobId)
      return NextResponse.json({ status: 'failed' })
    }
  }

  if (queueStatus.status === 'FAILED' as string) {
    await supabase
      .from('jobs')
      .update({ status: 'failed', error_message: 'fal.ai generation failed' })
      .eq('id', jobId)
    return NextResponse.json({ status: 'failed' })
  }

  // IN_QUEUE or IN_PROGRESS
  return NextResponse.json({ status: 'model_generating' })
}