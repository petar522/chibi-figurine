'use client'

import { useEffect, useRef, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

type Job = {
  id: string
  status: string
  illustration_url: string | null
  raw_model_url: string | null
  final_glb_url: string | null
  final_stl_url: string | null
  error_message: string | null
}

const STEPS = [
  { name: 'Illustration', icon: '🎨' },
  { name: '3D Model', icon: '🧊' },
  { name: 'Print Prep', icon: '⚙️' }
]

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

  const ModelViewer = 'model-viewer' as unknown as React.ElementType;

  async function fetchJob() {
    const { data } = await supabase.from('jobs').select('*').eq('id', jobId).single()
    if (data) setJob(data as Job)
  }

  useEffect(() => {
    fetchJob()
  }, [jobId])

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

  if (!job) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading your project...</div>

  if (job.status === 'failed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <div className="bg-white p-12 rounded-3xl shadow-xl text-center max-w-md border border-red-100">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">Generation Failed</h2>
          <p className="text-slate-500 mb-6">{job.error_message || 'An unknown error occurred.'}</p>
          <Link href="/dashboard" className="bg-slate-900 text-white font-semibold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const currentStep = stepIndexForStatus(job.status)

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-heading text-2xl font-extrabold text-slate-900">
            Chibi<span className="text-purple-600">3D</span>
          </Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">
        
        {/* Stepper UI */}
        <div className="flex justify-between items-center mb-12 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-purple-600 -translate-y-1/2 rounded-full transition-all duration-500"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          ></div>
          
          {STEPS.map((step, i) => (
            <div key={step.name} className="relative z-10 flex flex-col items-center bg-slate-50 px-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold border-4 transition-all duration-300 ${
                i < currentStep ? 'bg-purple-600 border-purple-600 text-white scale-110' :
                i === currentStep ? 'bg-white border-purple-600 text-purple-600 scale-110 animate-pulse' :
                'bg-white border-slate-300 text-slate-400'
              }`}>
                {i < currentStep ? '✓' : step.icon}
              </div>
              <span className={`mt-2 text-xs font-semibold ${i <= currentStep ? 'text-slate-900' : 'text-slate-400'}`}>
                {step.name}
              </span>
            </div>
          ))}
        </div>

        {/* Sadržaj zavisno od statusa */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8 md:p-12 min-h-[400px] flex flex-col items-center justify-center">
          
          {currentStep < 3 && (
            <div className="text-center">
              <h2 className="font-heading text-2xl font-bold text-slate-900 mb-2">
                {currentStep === 0 && 'Drawing your Chibi...'}
                {currentStep === 1 && 'Generating 3D geometry...'}
                {currentStep === 2 && 'Preparing for 3D print...'}
              </h2>
              <p className="text-slate-500 mb-8">This usually takes 1-2 minutes. Keep this window open.</p>
            </div>
          )}

          {illustrationSignedUrl && !finalGlbSignedUrl && (
            <div className="text-center">
              <img src={illustrationSignedUrl} alt="Chibi Illustration" className="max-w-[300px] rounded-2xl shadow-lg mx-auto" />
              <p className="mt-4 text-sm text-slate-500">AI Illustration Preview</p>
            </div>
          )}

          {glbSignedUrl && !finalGlbSignedUrl && (
            <div className="w-full h-[400px] bg-slate-100 rounded-2xl overflow-hidden">
              <ModelViewer src={glbSignedUrl} camera-controls auto-rotate shadow-intensity="1" class="w-full h-full" />
            </div>
          )}

          {finalGlbSignedUrl && (
            <div className="w-full flex flex-col items-center">
              <div className="w-full h-[500px] bg-linear-to-br from-purple-50 to-pink-50 rounded-2xl overflow-hidden mb-8">
                <ModelViewer src={finalGlbSignedUrl} camera-controls auto-rotate shadow-intensity="1" class="w-full h-full" />
              </div>
              
              <h2 className="font-heading text-3xl font-extrabold text-slate-900 mb-2 text-center">Your Figurine is Ready! 🎉</h2>
              <p className="text-slate-500 mb-8 text-center">Drag to rotate. Download your files below.</p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                {finalStlSignedUrl && (
                  <a 
                    href={finalStlSignedUrl} 
                    download="chibi-figurine.stl"
                    className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl text-center shadow-lg shadow-purple-600/30 transition-all"
                  >
                    Download STL (Print)
                  </a>
                )}
                <a 
                  href={finalGlbSignedUrl} 
                  download="chibi-figurine.glb"
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-4 rounded-xl text-center border border-slate-200 transition-all"
                >
                  Download GLB (View)
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}