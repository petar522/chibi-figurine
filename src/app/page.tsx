'use client'

import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

const ModelViewer = 'model-viewer' as unknown as React.ElementType;

const PACKAGES = [
  { name: 'Free', price: '$0', credits: '3', desc: 'Test the magic.', highlight: false, isFree: true },
  { name: 'Hobby', price: '$8.99', credits: '5', desc: 'For trying out more styles.', highlight: false, slug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/68e73d42-0522-438a-af66-9fe04ed00e56' },
  { name: 'Creator', price: '$14.99', credits: '10', desc: 'Best value for regular creators.', highlight: true, slug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/2d27b1e0-cdb9-4e6b-83d1-086e5675376e' },
  { name: 'Studio', price: '$35.99', credits: '30', desc: 'For power users & businesses.', highlight: false, slug: 'https://chibi-figurine.lemonsqueezy.com/checkout/buy/d2944f83-6a7a-4e73-8fce-bcfa0ce474c2' },
]

export default function Home() {
  const supabase = createClient()
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setIsLogged(!!data.user))
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* Navigacija */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <Link href={isLogged ? "/dashboard" : "/"} className="font-heading text-2xl font-extrabold text-slate-900">
          Chibi<span className="text-purple-600">3D</span>
        </Link>
        <div className="flex gap-6 items-center">
          <a href="#pricing" className="hidden md:block text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">Pricing</a>
          {isLogged ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">Dashboard</Link>
              <button onClick={handleSignOut} className="text-sm font-medium text-slate-700 hover:text-red-500 transition-colors">Sign out</button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">Sign in</Link>
              <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Sekcija */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6">
            <div className="inline-block bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold w-fit">
              🎁 Get 3 Free Generations
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Turn your photo into a <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500">3D Chibi Figure</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Upload a photo, and our AI will create a unique chibi illustration and turn it into a 3D model ready for printing or sharing.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/login" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105">
                Create your first figure
              </Link>
              <a href="#how-it-works" className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl transition-all">
                How it works
              </a>
            </div>
          </div>

          {/* Desni deo - 3D Model sa nakrivljenom slikom */}
          <div className="relative h-[500px] bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl shadow-xl overflow-hidden flex items-center justify-center">
            <ModelViewer 
              src="/hero-figurine.glb" 
              alt="3D Chibi Figure Example" 
              camera-controls 
              auto-rotate 
              shadow-intensity="1" 
              class="w-full h-full"
            />
            
            {/* Nakrivljena slika osobe (bez strelice) */}
            <div className="absolute top-6 right-6 transform rotate-6 z-20 bg-white p-2 rounded-xl shadow-2xl w-32 h-40 overflow-hidden border-4 border-white">
              <img src="/person-photo.png" alt="Original Person" className="w-full h-full object-cover rounded-md" />
            </div>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-xs font-bold text-slate-800 shadow-md">
              ⚡ AI Transformation
            </div>
          </div>
        </div>
      </section>

      {/* Kako Radi Sekcija */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl font-extrabold text-center text-slate-900 mb-16">Only 3 simple steps</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl mb-6">📸</div>
              <h3 className="font-heading text-xl font-bold mb-3">1. Upload Photo</h3>
              <p className="text-slate-600">Choose a clear photo of a face. JPEG and PNG formats are supported.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center text-4xl mb-6">🎨</div>
              <h3 className="font-heading text-xl font-bold mb-3">2. AI Draws Chibi</h3>
              <p className="text-slate-600">Artificial intelligence analyzes the face and creates a cute chibi illustration.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mb-6">🧊</div>
              <h3 className="font-heading text-xl font-bold mb-3">3. Download 3D</h3>
              <p className="text-slate-600">The system generates STL and GLB files, ready for 3D printing or sharing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Sekcija (4 Paketa) */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl font-extrabold text-center text-slate-900 mb-3">Simple, Credit-Based Pricing</h2>
          <p className="text-center text-slate-600 mb-16">No subscriptions. Buy credits only when you need them. Start with 3 free generations.</p>
          
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 items-start">
            {PACKAGES.map((pkg) => (
              <div key={pkg.name} className={`bg-white p-6 rounded-3xl shadow-md flex flex-col relative ${pkg.highlight ? 'border-2 border-purple-600 lg:scale-105 shadow-xl' : 'border border-slate-100'}`}>
                {pkg.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-4 py-1 rounded-full">POPULAR</div>
                )}
                <h3 className="font-heading text-xl font-bold mb-2 text-slate-900">{pkg.name}</h3>
                <p className="text-slate-500 text-sm mb-6">{pkg.desc}</p>
                <div className="mb-6">
                  <span className="text-3xl font-extrabold text-slate-900">{pkg.price}</span>
                  <span className="text-slate-400 ml-1 text-sm">/ {pkg.credits} credits</span>
                </div>
                <Link 
                  href={pkg.isFree ? "/login" : "#"} 
                  className={`block text-center font-bold py-3 rounded-xl transition-colors mt-auto ${pkg.highlight ? 'bg-purple-600 hover:bg-purple-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-800'}`}
                >
                  {pkg.isFree ? 'Get Started' : `Buy ${pkg.name}`}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-heading text-xl font-extrabold text-white">Chibi<span className="text-purple-500">3D</span></div>
          <p className="text-sm">© 2026 Chibi3D. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}