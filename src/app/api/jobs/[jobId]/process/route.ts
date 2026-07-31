import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHENTICATED' }, { status: 401 });
  }

  const { data: job, error: jobError } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', jobId)
    .eq('user_id', user.id)
    .single();

  if (jobError || !job || !job.raw_model_url) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  try {
    // Signed URL to let Blender service download the raw model
    const { data: downloadData, error: downloadErr } = await supabase.storage
      .from('job-files')
      .createSignedUrl(job.raw_model_url, 3600);

    if (downloadErr || !downloadData) throw new Error('Could not sign download URL');

    // Signed upload URLs so Blender service can PUT final files directly
    const finalGlbPath = job.raw_model_url.replace('raw-model.glb', 'final.glb');
    const finalStlPath = job.raw_model_url.replace('raw-model.glb', 'final.stl');

    const { data: glbUpload, error: glbErr } = await supabase.storage
      .from('job-files')
      .createSignedUploadUrl(finalGlbPath);

    const { data: stlUpload, error: stlErr } = await supabase.storage
      .from('job-files')
      .createSignedUploadUrl(finalStlPath);

    if (glbErr || stlErr || !glbUpload || !stlUpload) {
      throw new Error('Could not create upload URLs');
    }

    const res = await fetch(`${process.env.BLENDER_SERVICE_URL}/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        glb_url: downloadData.signedUrl,
        upload_glb_url: glbUpload.signedUrl,
        upload_stl_url: stlUpload.signedUrl,
      }),
    });

    if (!res.ok) throw new Error('Blender service request failed');

    const { job_id: blenderJobId } = await res.json();

    await supabase
      .from('jobs')
      .update({
        status: 'processing',
        blender_job_id: blenderJobId,
        final_glb_url: finalGlbPath,
        final_stl_url: finalStlPath,
      })
      .eq('id', jobId);

    return NextResponse.json({ blenderJobId });
  } catch (err) {
    await supabase
      .from('jobs')
      .update({
        status: 'failed',
        error_message: err instanceof Error ? err.message : 'Blender processing failed',
      })
      .eq('id', jobId);

    return NextResponse.json({ error: 'PROCESS_FAILED' }, { status: 500 });
  }
}