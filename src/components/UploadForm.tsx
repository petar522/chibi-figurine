'use client'

import { useState, useCallback, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 5 * 1024 * 1024 // 5MB

export default function UploadForm() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const supabase = createClient()

  function validateAndSetFile(f: File) {
    setError(null)
    if (!ALLOWED_TYPES.includes(f.type)) {
      setError('Dozvoljeni formati: JPG, PNG, WebP.')
      return
    }
    if (f.size > MAX_SIZE) {
      setError('Slika mora biti manja od 5MB.')
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
      if (!user) throw new Error('Nisi ulogovan.')

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
          setError('Nemaš više kredita za generisanje.')
        } else {
          setError('Nešto je pošlo po zlu, pokušaj ponovo.')
        }
        setUploading(false)
        return
      }

      router.push(`/jobs/${body.jobId}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Greška pri uploadu.')
      setUploading(false)
    }
  }

  if (preview) {
    return (
      <div>
        <img src={preview} alt="Preview" style={{ maxWidth: 300 }} />
        <div>
          <button onClick={handleConfirm} disabled={uploading}>
            {uploading ? 'Šaljem...' : 'Potvrdi i generiši'}
          </button>
          <button onClick={reset} disabled={uploading}>
            Izaberi drugu sliku
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
      style={{
        border: dragActive ? '2px solid #2C1810' : '2px dashed #D4A86A',
        padding: 40,
        textAlign: 'center',
        cursor: 'pointer',
      }}
    >
      <p>Prevuci sliku ovde ili klikni da izabereš</p>
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