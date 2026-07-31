import Link from 'next/link'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-heading text-2xl font-extrabold text-slate-900">Chibi<span className="text-purple-600">3D</span></Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16 flex-grow">
        <h1 className="font-heading text-3xl font-bold mb-6 text-slate-900">Terms of Service</h1>
        <div className="prose text-slate-600 space-y-4">
          <p>By using Chibi3D, you agree to these terms. You are granted a non-exclusive, non-transferable license to use the generated 3D models for personal and commercial purposes.</p>
          <p>You may not use the service to generate inappropriate content, violate intellectual property rights, or harm others. We reserve the right to terminate accounts that violate these terms.</p>
          <p>Payments are processed securely by Lemon Squeezy. Refunds are handled on a case-by-case basis.</p>
        </div>
      </div>
      <footer className="bg-slate-900 text-slate-400 py-12 px-6 mt-auto">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm">© 2026 Chibi3D. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}