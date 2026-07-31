import UploadForm from '@/components/UploadForm'

export default function Home() {
  return (
    <main style={{ maxWidth: 500, margin: '60px auto', padding: 20 }}>
      <h1>Test Upload</h1>
      <UploadForm />
    </main>
  )
}