import type { Metadata, Viewport } from "next"
import { Archivo_Black, Caveat, DM_Sans, JetBrains_Mono } from "next/font/google"
import Script from "next/script"
import { BottomNav } from "./components/bottom-nav"
import { PwaInstall } from "./components/pwa-install"
import "./globals.css"

const archivoBlack = Archivo_Black({ weight: "400", subsets: ["latin", "latin-ext"], variable: "--font-archivo", display: "swap" })
const dmSans = DM_Sans({ weight: ["300", "400", "500", "700"], subsets: ["latin", "latin-ext"], variable: "--font-dm-sans", display: "swap" })
const jetbrainsMono = JetBrains_Mono({ weight: ["400", "500"], subsets: ["latin", "latin-ext"], variable: "--font-jetbrains", display: "swap" })
const caveat = Caveat({ weight: ["400", "700"], subsets: ["latin", "latin-ext"], variable: "--font-caveat", display: "swap" })

export const metadata: Metadata = {
  title: "Kurumsal Psikoloji Birimi — Arnavutköy Belediyesi",
  description: "Arnavutköy Belediyesi Kurumsal Psikoloji Birimi. Randevu alın, testleri doldurun, psikologunuzla iletişime geçin.",
  openGraph: {
    title: "Kurumsal Psikoloji Birimi",
    description: "Arnavutköy Belediyesi — Uzm. Kl. Psk. Yusuf Pamuk",
    type: "website",
    images: [{ url: "/logos/arnavutkoy.png", width: 1218, height: 1080, alt: "Arnavutköy Belediyesi" }],
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f5f0eb",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${archivoBlack.variable} ${dmSans.variable} ${jetbrainsMono.variable} ${caveat.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Psikoloji" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
        <main className="flex-1 pb-20">
          {children}
        </main>

        <footer className="pb-20 pt-2 px-6 text-center">
          <p className="text-[10px] text-on-surface-variant/30">
            powered by <span className="font-semibold">Uzm. Kl. Psk. Yusuf Pamuk</span>
          </p>
        </footer>

        <BottomNav />
        <PwaInstall />
        <Script id="sw" strategy="afterInteractive">{`
          if ('serviceWorker' in navigator) {
            if (location.hostname === 'localhost') {
              navigator.serviceWorker.getRegistrations().then(r => r.forEach(w => w.unregister()))
            } else {
              navigator.serviceWorker.register('/sw.js')
            }
          }
        `}</Script>
      </body>
    </html>
  )
}
