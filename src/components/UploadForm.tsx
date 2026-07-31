'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Provera da li je korisnik ulogovan odmah po ucitavanju komponente
  useState(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsLoggedIn(!!data.user)
    })
  })

  function validateAndSetFile(f: File) {
    setError(null)
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Allowed formats: JPG, PNG, WebP.')
      return
    }
    if (f.size > MAX_SIZE) {
      setError('Image must be smaller than 5MB.')
      return
    }
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const f = e.dataTransfer.files?.[0]
    if (f) validateAndSetFile(f)
  }, [])

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (f) validateAndSetFile(f)
  }

  function reset() {
    setFile(null)
    setPreview(null)
    setError(null)
  }

  async function handleConfirm() {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('You must be logged in to generate.')
        setUploading(false)
        return
      }

      const ext = file.name.split('.').pop()
      const tempId = crypto.randomUUID()
      const path = `${user.id}/${tempId}/original.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('job-files')
        .upload(path, file, { contentType: file.type })

      if (uploadError) throw uploadError

      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imagePath: path }),
      })

      const body = await res.json()

      if (!res.ok) {
        if (body.error === 'INSUFFICIENT_CREDITS') {
          setError('You are out of credits.')
        } else {
          setError('Something went wrong, please try again.')
        }
        setUploading(false)
        return
      }

      router.push(`/jobs/${body.jobId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload error.')
      setUploading(false)
    }
  }

  // Ako proveravamo login status
  if (isLoggedIn === null) {
    return <div className="text-center text-slate-500">Loading...</div>
  }

  // Ako nije ulogovan, ne prikazuj formu uopšte!
  if (isLoggedIn === false) {
    return (
      <div className="text-center flex flex-col items-center gap-4 py-8">
        <p className="text-slate-700 font-medium text-lg">You need to sign in to upload a photo.</p>
        <Link href="/login" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-purple-600/30 transition-all">
          Sign in
        </Link>
      </div>
    )
  }

  if (preview) {
    return (
      <div className="flex flex-col items-center gap-4">
        <img src={preview} alt="Preview" className="max-w-[250px] rounded-xl shadow-md" />
        <div className="flex gap-3">
          <button onClick={handleConfirm} disabled={uploading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors">
            {uploading ? 'Uploading...' : 'Confirm & Generate'}
          </button>
          <button onClick={reset} disabled={uploading} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-6 py-2.5 rounded-lg transition-colors">
            Choose another
          </button>
        </div>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    )
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
      onDragLeave={() => setDragActive(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed p-10 rounded-2xl text-center cursor-pointer transition-colors ${dragActive ? 'border-purple-600 bg-purple-50' : 'border-slate-300 hover:border-slate-400'}`}
    >
      <p className="text-slate-600 mb-2">Drag & drop your photo here, or click to select</p>
      <p className="text-xs text-slate-400">JPG, PNG, WebP (MAX 5MB)</p>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={onPick}
        style={{ display: 'none' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  )
}