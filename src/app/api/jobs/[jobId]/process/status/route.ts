import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(
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

  if (jobError || !job || !job.blender_job_id) {
    return NextResponse.json({ error: 'NOT_FOUND' }, { status: 404 });
  }

  if (job.status === 'completed' || job.status === 'failed') {
    return NextResponse.json({ status: job.status });
  }

  const res = await fetch(`${process.env.BLENDER_SERVICE_URL}/status/${job.blender_job_id}`);
  const blenderStatus = await res.json();

  if (blenderStatus.status === 'completed') {
    await supabase.from('jobs').update({ status: 'completed' }).eq('id', jobId);
    return NextResponse.json({ status: 'completed' });
  }

  if (blenderStatus.status === 'failed') {
    await supabase
      .from('jobs')
      .update({ status: 'failed', error_message: blenderStatus.error || 'Blender processing failed' })
      .eq('id', jobId);
    return NextResponse.json({ status: 'failed' });
  }

  return NextResponse.json({ status: 'processing' });
}