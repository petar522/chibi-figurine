import Link from 'next/link';
import UploadForm from '@/components/UploadForm';
const ModelViewer = 'model-viewer' as unknown as React.ElementType;

export default function Home() {
  return (
    <div className="bg-slate-50">
      {/* Navigacija */}
      <nav className="absolute top-0 left-0 right-0 z-10 p-6 flex justify-between items-center max-w-7xl mx-auto">
        <div className="font-heading text-2xl font-extrabold text-slate-900">
          Chibi<span className="text-purple-600">3D</span>
        </div>
        <Link href="/dashboard" className="text-sm font-medium text-slate-700 hover:text-purple-600 transition-colors">
          Moj nalog
        </Link>
      </nav>

      {/* Hero Sekcija */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Levi deo - Tekst */}
          <div className="flex flex-col gap-6">
            <div className="inline-block bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold w-fit">
              🚀 Generisano za 2 minuta
            </div>
            <h1 className="font-heading text-5xl md:text-6xl font-extrabold leading-tight text-slate-900">
              Pretvori svoju sliku u <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500">3D Chibi Figuricu</span>
            </h1>
            <p className="text-lg text-slate-600 font-light">
              Uploaduj fotografiju, a naša veštačka inteligencija će napraviti unikatnu chibi ilustraciju i pretvoriti je u 3D model spreman za štampu ili deljenje.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="#upload" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-8 py-4 rounded-xl shadow-lg shadow-purple-600/30 transition-all hover:scale-105">
                Isprobaj besplatno
              </a>
              <a href="#how-it-works" className="bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold px-8 py-4 rounded-xl transition-all">
                Kako radi?
              </a>
            </div>
          </div>

          {/* Desni deo - 3D Model Preview */}
          <div className="relative h-[500px] bg-linear-to-br from-purple-100 to-pink-100 from-purple-100 to-pink-100 rounded-3xl shadow-xl overflow-hidden flex items-center justify-center">
            {/* Ovde stavi neki svoj model sa raw_model_url ili final_glb_url u src */}
            <ModelViewer 
              src="https://modelviewer.dev/shared-assets/models/Astronaut.glb" 
              alt="Primer 3D figurice" 
              camera-controls 
              auto-rotate 
              shadow-intensity="1" 
              class="w-full h-full"
            ></ModelViewer>
            <div className="absolute bottom-4 left-4 bg-white/80 backdrop-blur px-3 py-1 rounded-full text-xs font-medium text-slate-800">
              Rotiraj model da ga pogledaš
            </div>
          </div>
        </div>
      </section>

      {/* Kako Radi Sekcija */}
      <section id="how-it-works" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-heading text-4xl font-extrabold text-center text-slate-900 mb-16">
            Samo 3 jednostavna koraka
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {/* Korak 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
                📸
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">1. Uploaduj sliku</h3>
              <p className="text-slate-600">Izaberi jasnu fotografiju lica. JPEG i PNG formati su podržani.</p>
            </div>
            {/* Korak 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-pink-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
                🎨
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">2. AI crta chibi</h3>
              <p className="text-slate-600">Veštačka inteligencija analizira lice i stvara simpatičnu chibi ilustraciju.</p>
            </div>
            {/* Korak 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center text-4xl mb-6">
                🧊
              </div>
              <h3 className="font-heading text-xl font-bold mb-3">3. Preuzmi 3D</h3>
              <p className="text-slate-600">Sistem generiše STL i GLB fajlove, spremne za 3D štampu ili deljenje.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upload Sekcija */}
      <section id="upload" className="py-24 px-6 bg-slate-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="font-heading text-4xl font-extrabold text-center text-slate-900 mb-3">
            Spreman za svoju figuricu?
          </h2>
          <p className="text-center text-slate-600 mb-12">Prva generacija je besplatna. Samo uploaduj sliku ispod.</p>
          
          <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-slate-100">
            <UploadForm />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="font-heading text-xl font-extrabold text-white">
            Chibi<span className="text-purple-500">3D</span>
          </div>
          <p className="text-sm">© 2024 Chibi3D. Sva prava zadržana.</p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition-colors">Uslovi korišćenja</a>
            <a href="#" className="hover:text-white transition-colors">Privatnost</a>
          </div>
        </div>
      </footer>
    </div>
  );
}