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
        <Link href="/login" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">
          Sign in
        </Link>
      </nav>

      {/* Hero Sekcija */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Levi deo - Tekst */}
          <div className="flex flex-col gap-6">
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold w-fit">
              🚀 Generated in 2 minutes
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Turn your photo into a <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-500">3D Chibi Figure</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Upload a photo, and our AI will create a unique chibi illustration and turn it into a 3D model ready for printing or sharing.
            </p>
            <div className="flex gap-4 mt-4">
              <Link href="/login" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105">
                Try for free
              </Link>
              <a href="#how-it-works" className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl transition-all">
                How it works
              </a>
            </div>
          </div>

          {/* Desni deo - 3D Model Preview */}
          <div className="relative h-[500px] bg-linear-to-br from-purple-100 to-pink-100 rounded-3xl shadow-xl overflow-hidden flex items-center justify-center">
            <ModelViewer 
              src="/hero-figurine.glb"
              alt="3D Chibi Figure Example" 
              camera-controls 
              auto-rotate 
              shadow-intensity="1" 
              class="w-full h-full"
            />
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-800">
              Drag to rotate
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
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
                📸
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">1. Upload Photo</h3>
              <p className="text-slate-600">Choose a clear photo of a face. JPEG and PNG formats are supported.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
                🎨
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">2. AI Draws Chibi</h3>
              <p className="text-slate-600">Artificial intelligence analyzes the face and creates a cute chibi illustration.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
                🧊
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">3. Download 3D</h3>
              <p className="text-slate-600">The system generates STL and GLB files, ready for 3D printing or sharing.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Sekcija umesto otvorene forme */}
      <section id="upload" className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-extrabold text-slate-900 mb-3">
            Ready for your figurine?
          </h2>
          <p className="text-slate-600 mb-12">Your first generation is free. Sign in to upload your photo.</p>
          
          <Link href="/login" className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold px-10 py-4 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105 text-lg">
            Get Started
          </Link>
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