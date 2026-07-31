import Link from 'next/link';

const ModelViewer = 'model-viewer' as unknown as React.ElementType;

export default function Home() {
  return (
    <div className="bg-slate-50">
      {/* Navigacija */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="font-heading text-2xl font-extrabold text-slate-900">
          Chibi<span className="text-purple-600">3D</span>
        </div>
        <div className="flex gap-6 items-center">
          <a href="#pricing" className="hidden md:block text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">Pricing</a>
          <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">Sign in</Link>
          <Link href="/login" className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">Get Started</Link>
        </div>
      </nav>

            {/* Hero Sekcija */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Levi deo - Tekst */}
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

          {/* Desni deo - 3D Model sa nakrivljenom slikom i strelicom */}
          <div className="relative h-[500px] bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl shadow-xl overflow-hidden flex items-center justify-center">
            <ModelViewer 
              src="/hero-figurine.glb" 
              alt="3D Chibi Figure Example" 
              camera-controls 
              auto-rotate 
              shadow-intensity="1" 
              class="w-full h-full"
            />
            
            {/* Nakrivljena slika osobe */}
            <div className="absolute top-6 right-6 transform rotate-6 z-20 bg-white p-2 rounded-xl shadow-2xl w-32 h-40 overflow-hidden border-4 border-white">
              <img 
                src="/person-photo.png" 
                alt="Original Person" 
                className="w-full h-full object-cover rounded-md"
              />
            </div>

            {/* Strelica od slike ka modelu */}
            <div className="absolute top-44 right-36 z-20 text-purple-600 transform -rotate-45">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
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
          <h2 className="font-heading text-4xl font-extrabold text-center text-slate-900 mb-16">
            Only 3 simple steps
          </h2>
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

      {/* Pricing Sekcija */}
      <section id="pricing" className="py-24 px-6 bg-slate-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-heading text-4xl font-extrabold text-center text-slate-900 mb-3">
            Simple, Credit-Based Pricing
          </h2>
          <p className="text-center text-slate-600 mb-16">No subscriptions. Buy credits only when you need them. Start with 3 free generations.</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col">
              <h3 className="font-heading text-xl font-bold mb-2">Starter</h3>
              <p className="text-slate-500 mb-6">For trying out the magic.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$0</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-600 flex-grow">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 3 Free Generations</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Standard Quality</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> GLB & STL Downloads</li>
              </ul>
              <Link href="/login" className="block text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 rounded-xl transition-colors">
                Claim Free Credits
              </Link>
            </div>

            {/* Paid Plan 1 */}
            <div className="bg-purple-600 p-8 rounded-3xl shadow-xl flex flex-col relative scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">POPULAR</div>
              <h3 className="font-heading text-xl font-bold mb-2 text-white">Creator</h3>
              <p className="text-purple-200 mb-6">For regular creators.</p>
              <div className="mb-6 text-white">
                <span className="text-4xl font-extrabold">$6</span>
                <span className="text-purple-200 ml-1">/ 10 credits</span>
              </div>
              <ul className="space-y-3 mb-8 text-purple-100 flex-grow">
                <li className="flex items-center gap-2"><span className="text-pink-300">✓</span> 10 Generations</li>
                <li className="flex items-center gap-2"><span className="text-pink-300">✓</span> High Quality</li>
                <li className="flex items-center gap-2"><span className="text-pink-300">✓</span> Priority Queue</li>
                <li className="flex items-center gap-2"><span className="text-pink-300">✓</span> Commercial Use</li>
              </ul>
              <Link href="/login" className="block text-center bg-white hover:bg-slate-100 text-purple-700 font-bold py-3 rounded-xl transition-colors">
                Buy Creator Pack
              </Link>
            </div>

            {/* Paid Plan 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 flex flex-col">
              <h3 className="font-heading text-xl font-bold mb-2">Studio</h3>
              <p className="text-slate-500 mb-6">For power users & businesses.</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-slate-900">$15</span>
                <span className="text-slate-500 ml-1">/ 30 credits</span>
              </div>
              <ul className="space-y-3 mb-8 text-slate-600 flex-grow">
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> 30 Generations</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Highest Quality</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Fast Priority Queue</li>
                <li className="flex items-center gap-2"><span className="text-green-500">✓</span> Commercial Use</li>
              </ul>
              <Link href="/login" className="block text-center bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-xl transition-colors">
                Buy Studio Pack
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-heading text-xl font-extrabold text-white">
            Chibi<span className="text-purple-500">3D</span>
          </div>
          <p className="text-sm">© 2024 Chibi3D. All rights reserved.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}