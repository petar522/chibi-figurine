'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import UploadForm from '@/components/UploadForm'
import Link from 'next/link'

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(0)
  const [jobs, setJobs] = useState<any[]>([])
  const [illustrationUrls, setIllustrationUrls] = useState<Record<string, string>>({})

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data: profile } = await supabase.from('profiles').select('credits').eq('id', user.id).single()
      const { data: userJobs } = await supabase.from('jobs').select('id, status, illustration_url, created_at, error_message').eq('user_id', user.id).order('created_at', { ascending: false })

      setCredits(profile?.credits || 0)
      setJobs(userJobs || [])

      if (userJobs) {
        const urls: Record<string, string> = {}
        for (const job of userJobs) {
          if (job.illustration_url) {
            const { data } = await supabase.storage.from('job-files').createSignedUrl(job.illustration_url, 3600)
            if (data) urls[job.id] = data.signedUrl
          }
        }
        setIllustrationUrls(urls)
      }
      setLoading(false)
    }
    loadData()
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading your studio...</div>

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-heading text-2xl font-extrabold text-slate-900">Chibi<span className="text-purple-600">3D</span></Link>
<div className="flex items-center gap-6">
  <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-1.5 rounded-full">
    <span className="text-sm font-medium text-slate-500">Credits:</span>
    <span className="text-sm font-bold text-purple-600">{credits}</span>
  </div>
  <Link href="/pricing" className="text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors">Buy more</Link>
  <Link href="/support" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">Support</Link>
  <button onClick={handleSignOut} className="text-sm font-medium text-slate-700 hover:text-red-500 transition-colors">Sign out</button>
</div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-3 gap-8 flex-grow">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 sticky top-24">
            <h1 className="font-heading text-2xl font-extrabold text-slate-900 mb-2">Create New Figurine</h1>
            <p className="text-slate-500 text-sm mb-6">You have <span className="font-bold text-purple-600">{credits} credits</span> left.</p>
            {credits > 0 ? <UploadForm /> : (
              <div className="text-center py-8 flex flex-col items-center gap-4">
                <p className="text-slate-600">You are out of credits! 🔮</p>
                <Link href="/pricing" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all">Buy more credits</Link>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-heading text-2xl font-extrabold text-slate-900 mb-6">Your Creations</h2>
          {jobs.length === 0 ? (
            <div className="bg-white rounded-3xl border-2 border-dashed border-slate-200 p-12 text-center flex flex-col items-center">
              <div className="text-5xl mb-4">📭</div>
              <h3 className="font-bold text-slate-800 text-lg">No figurines yet</h3>
              <p className="text-slate-500 mt-1">Your generated figures will appear here.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
              {jobs.map(job => (
                <Link href={`/jobs/${job.id}`} key={job.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="aspect-square bg-slate-100 overflow-hidden flex items-center justify-center">
                    {illustrationUrls[job.id] ? <img src={illustrationUrls[job.id]} alt="Chibi" className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="text-slate-300 text-sm">No preview</div>}
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <span className="text-xs text-slate-500">{new Date(job.created_at).toLocaleDateString()}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full capitalize ${job.status === 'completed' ? 'bg-green-100 text-green-700' : job.status === 'failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{job.status}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-heading text-xl font-extrabold text-white">Chibi<span className="text-purple-500">3D</span></div>
          <p className="text-sm">© 2026 Chibi3D. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/support" className="hover:text-white transition-colors">Support</Link>
            <a href="mailto:support@chibi3d.store" className="hover:text-white transition-colors">Contact Email</a>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            </div>
        </div>
      </footer>
    </div>
  )
}