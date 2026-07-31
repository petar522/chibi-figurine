'use client'

import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

export default function LoginPage() {

  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const supabase = createClient()

  async function signInWithGoogle() {
    const result = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }

  async function signInWithMagicLink(e: React.FormEvent) {
    e.preventDefault()
    const result = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    })
    setSent(true)
  }

  return (
    <div>
      <button onClick={signInWithGoogle}>Prijavi se sa Google-om</button>
      {sent ? (
        <p>Proveri email za magic link.</p>
      ) : (
        <form onSubmit={signInWithMagicLink}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tvoj@email.com"
            required
          />
          <button type="submit">Pošalji magic link</button>
        </form>
      )}
    </div>
  )
}