import { createClient } from '@/lib/supabase/server'
import { CHIBI_PROMPT } from '@/lib/prompts'
import { NextResponse } from 'next/server'

export const maxDuration = 60 // seconds — needs Vercel Pro plan for this to actually apply above 10s

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 })
  }

  // fetch the job and confirm ownership
  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single()

if (jobError || !job) {
  return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 })
}

// ako je ilustracija već gotova, ne radi ponovo
if (job.status === 'illustration_ready' || job.status === 'model_generating' || job.status === 'model_ready') {
  return NextResponse.json({ illustrationUrl: job.illustration_url })
}

await supabase
  .from('jobs')
  .update({ status: 'illustration_generating' })
  .eq('id', jobId)

  try {
    // download the original image bytes from storage
    const { data: imageBlob, error: downloadError } = await supabase.storage
      .from('job-files')
      .download(job.original_image_url)

    if (downloadError || !imageBlob) throw new Error('Could not read original image')

    const form = new FormData()
    form.append('model', 'gpt-image-1')
    form.append('image', imageBlob, 'original.png')
    form.append('prompt', CHIBI_PROMPT)
    form.append('size', '1024x1024')

    const response = await fetch('https://api.openai.com/v1/images/edits', {
      method: 'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(`OpenAI error: ${errText}`)
    }

    const result = await response.json()
    const b64 = result.data[0].b64_json
    const buffer = Buffer.from(b64, 'base64')

    const illustrationPath = job.original_image_url.replace('original.', 'illustration.').replace(/\.\w+$/, '.png')

    const { error: uploadError } = await supabase.storage
  .from('job-files')
  .upload(illustrationPath, buffer, { contentType: 'image/png', upsert: true })

    if (uploadError) throw uploadError

    await supabase
      .from('jobs')
      .update({ status: 'illustration_ready', illustration_url: illustrationPath })
      .eq('id', jobId)

    return NextResponse.json({ illustrationUrl: illustrationPath })
  } catch (err) {
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Unknown error',
      })
      .eq('id', jobId)

    return NextResponse.json({ error: 'GENERATION_FAILED' }, { status: 500 })
  }
}