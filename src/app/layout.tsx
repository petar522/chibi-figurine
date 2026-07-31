import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Chibi3D | Turn Your Photo into a 3D Chibi Figure",
  description: "Upload a photo, and our AI will create a unique chibi illustration and turn it into a 3D model ready for printing or sharing.",
  openGraph: {
    title: "Chibi3D | Turn Your Photo into a 3D Chibi Figure",
    description: "Upload a photo, and our AI will create a unique chibi illustration and turn it into a 3D model ready for printing or sharing.",
    images: ['/illustration.png'], // Ovo će biti slika koja se prikazuje na Instagramu
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sr"
      className={`${inter.variable} ${poppins.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50 font-sans">
        <script type="module" src="https://unpkg.com/@google/model-viewer/dist/model-viewer.min.js"></script>
        {children}
      </body>
    </html>
  );
}