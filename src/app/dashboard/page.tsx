'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import UploadForm from '@/components/UploadForm'
import Link from 'next/link'

export default function DashboardPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Proveravamo da li je korisnik ulogovan, ako nije, šaljemo ga na login
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        window.location.href = '/login'
      } else {
        setLoading(false)
      }
    })
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigacija za dashboard */}
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-heading text-2xl font-extrabold text-slate-900">
            Chibi<span className="text-purple-600">3D</span>
          </Link>
          <button onClick={handleSignOut} className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">
            Sign out
          </button>
        </div>
      </nav>

      {/* Sadržaj dashboarda */}
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="font-heading text-4xl font-extrabold text-slate-900 mb-3">
            Create a new figurine
          </h1>
          <p className="text-slate-600">Upload a clear photo to generate your 3D chibi.</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
          <UploadForm />
        </div>
      </div>
    </div>
  )
}