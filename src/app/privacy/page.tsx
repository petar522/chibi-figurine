import Link from 'next/link'

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="font-heading text-2xl font-extrabold text-slate-900">Chibi<span className="text-purple-600">3D</span></Link>
        </div>
      </nav>
      <div className="max-w-3xl mx-auto px-6 py-16 flex-grow">
        <h1 className="font-heading text-3xl font-bold mb-6 text-slate-900">Privacy Policy</h1>
        <div className="prose text-slate-600 space-y-4">
          <p>Your privacy is important to us. We collect minimal data necessary to provide the service, including your email and uploaded photos.</p>
          <p>Uploaded photos are stored securely and used only to generate your 3D figurine. We do not share your data with third parties except as required to process AI generations (OpenAI, fal.ai).</p>
          <p>You can request deletion of your data and account at any time.</p>
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