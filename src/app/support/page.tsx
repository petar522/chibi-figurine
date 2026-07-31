'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'
import Link from 'next/link'

export default function SupportPage() {
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ email: '', subject: '', message: '' })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    const { data: { user } } = await supabase.auth.getUser()
    
    // Čuvamo u bazu
    await supabase.from('support_tickets').insert({
      user_id: user?.id,
      email: form.email,
      subject: form.subject,
      message: form.message
    })

    // Ovde kasnije možemo dodati slanje mejla tebi preko Resend API-ja
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/dashboard" className="font-heading text-2xl font-extrabold text-slate-900">Chibi<span className="text-purple-600">3D</span></Link>
          <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-purple-600">Dashboard</Link>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-16 flex-grow w-full">
        <h1 className="font-heading text-3xl font-bold mb-2 text-slate-900">Support Center</h1>
        <p className="text-slate-500 mb-8">Having issues with a generation? Let us know.</p>

        {sent ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-2xl text-center">
            <h2 className="font-bold text-lg mb-2">Ticket Submitted! 🎫</h2>
            <p>We received your message and will get back to you soon.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Your Email</label>
              <input 
                type="email" 
                required 
                value={form.email} 
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
              <input 
                type="text" 
                required 
                value={form.subject} 
                onChange={(e) => setForm({...form, subject: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Describe the issue</label>
              <textarea 
                required 
                rows={5} 
                value={form.message} 
                onChange={(e) => setForm({...form, message: e.target.value})}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:border-purple-500"
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Submit Ticket'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}