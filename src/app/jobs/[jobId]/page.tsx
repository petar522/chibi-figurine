'use client'

import { useEffect, useRef, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'

type Job = {
  id: string
  status: string
  illustration_url: string | null
  raw_model_url: string | null
  final_glb_url: string | null
  final_stl_url: string | null
  error_message: string | null
}

const STEPS = ['Chibi illustration', '3D model', 'Print processing', 'Done']

function stepIndexForStatus(status: string) {
  if (['uploaded', 'illustration_generating'].includes(status)) return 0
  if (['illustration_ready', 'model_generating'].includes(status)) return 1
  if (['model_ready', 'processing'].includes(status)) return 2
  if (status === 'completed') return 3
  return 0
}

export default function JobPage({ params }: { params: Promise<{ jobId: string }> }) {
  const { jobId } = use(params)
  const supabase = createClient()
  const [job, setJob] = useState<Job | null>(null)
  const [illustrationSignedUrl, setIllustrationSignedUrl] = useState<string | null>(null)
  const [glbSignedUrl, setGlbSignedUrl] = useState<string | null>(null)
  const [finalGlbSignedUrl, setFinalGlbSignedUrl] = useState<string | null>(null)
  const [finalStlSignedUrl, setFinalStlSignedUrl] = useState<string | null>(null)

  const triggeredIllustration = useRef(false)
  const triggeredModel = useRef(false)
  const triggeredProcess = useRef(false)

  async function fetchJob() {
    const { data } = await supabase.from('jobs').select('*').eq('id', jobId).single()
    if (data) setJob(data as Job)
  }

  useEffect(() => {
    fetchJob()
  }, [jobId])

  // sign urls for whatever's available
  useEffect(() => {
    if (!job) return

    async function sign(path: string, setter: (url: string) => void) {
      const { data } = await supabase.storage.from('job-files').createSignedUrl(path, 3600)
      if (data) setter(data.signedUrl)
    }

    if (job.illustration_url) sign(job.illustration_url, setIllustrationSignedUrl)
    if (job.raw_model_url) sign(job.raw_model_url, setGlbSignedUrl)
    if (job.final_glb_url) sign(job.final_glb_url, setFinalGlbSignedUrl)
    if (job.final_stl_url) sign(job.final_stl_url, setFinalStlSignedUrl)
  }, [job?.illustration_url, job?.raw_model_url, job?.final_glb_url, job?.final_stl_url])

  // orchestration
  useEffect(() => {
    if (!job) return

    if (job.status === 'uploaded' && !triggeredIllustration.current) {
      triggeredIllustration.current = true
      fetch(`/api/jobs/${jobId}/illustration`, { method: 'POST' }).finally(fetchJob)
    }

    if (job.status === 'illustration_ready' && !triggeredModel.current) {
      triggeredModel.current = true
      fetch(`/api/jobs/${jobId}/model`, { method: 'POST' }).finally(fetchJob)
    }

    if (job.status === 'model_ready' && !triggeredProcess.current) {
      triggeredProcess.current = true
      fetch(`/api/jobs/${jobId}/process`, { method: 'POST' }).finally(fetchJob)
    }
  }, [job?.status])

  // polling while a background step is running
  useEffect(() => {
    if (!job) return
    if (!['illustration_generating', 'model_generating', 'processing'].includes(job.status)) return

    const interval = setInterval(async () => {
      if (job.status === 'model_generating') {
        await fetch(`/api/jobs/${jobId}/model/status`)
      } else if (job.status === 'processing') {
        await fetch(`/api/jobs/${jobId}/process/status`)
      }
      fetchJob()
    }, 3000)

    return () => clearInterval(interval)
  }, [job?.status])

  if (!job) return <p>Loading...</p>

  if (job.status === 'failed') {
    return (
      <main style={{ maxWidth: 500, margin: '60px auto' }}>
        <h2>Something went wrong</h2>
        <p style={{ color: 'red' }}>{job.error_message || 'Unknown error'}</p>
      </main>
    )
  }

  const currentStep = stepIndexForStatus(job.status)

  return (
    <main style={{ maxWidth: 600, margin: '60px auto', padding: 20 }}>
      <h1>Creating your figurine</h1>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {STEPS.map((label, i) => (
          <li
            key={label}
            style={{
              padding: '10px 0',
              fontWeight: i === currentStep ? 'bold' : 'normal',
              color: i < currentStep ? '#2C1810' : i === currentStep ? '#000' : '#aaa',
            }}
          >
            {i < currentStep ? '✓' : i === currentStep ? '→' : '○'} {label}
          </li>
        ))}
      </ul>

      {illustrationSignedUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Illustration</h3>
          <img src={illustrationSignedUrl} alt="Chibi illustration" style={{ maxWidth: 250 }} />
        </div>
      )}

      {glbSignedUrl && !finalGlbSignedUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>3D model (raw)</h3>
          {/* @ts-expect-error model-viewer is a web component */}
          <model-viewer src={glbSignedUrl} camera-controls auto-rotate style={{ width: '100%', height: 300 }} />
        </div>
      )}

      {finalGlbSignedUrl && (
        <div style={{ marginTop: 20 }}>
          <h3>Final figurine</h3>
          {/* @ts-expect-error model-viewer is a web component */}
          <model-viewer src={finalGlbSignedUrl} camera-controls auto-rotate style={{ width: '100%', height: 300 }} />
          <div style={{ display: 'flex', gap: 12, marginTop: 12 }}>
            {finalStlSignedUrl && (
              <a
                href={finalStlSignedUrl}
                download="figurine.stl"
                style={{ padding: '8px 16px', background: '#2C1810', color: 'white', borderRadius: 4, textDecoration: 'none' }}
              >
                Download STL (for printing)
              </a>
            )}
            <a
              href={finalGlbSignedUrl}
              download="figurine.glb"
              style={{ padding: '8px 16px', background: '#eee', border: '1px solid #ccc', borderRadius: 4, textDecoration: 'none', color: '#000' }}
            >
              Download GLB (for viewing/sharing)
            </a>
          </div>
        </div>
      )}
    </main>
  )
}