import type { Metadata, Viewport } from "next"
import { Manrope, Inter } from "next/font/google"
import { BottomNav } from "./components/bottom-nav"
import { Onboarding } from "./components/onboarding"
import "./globals.css"

const manrope = Manrope({ subsets: ["latin", "latin-ext"], variable: "--font-manrope", display: "swap" })
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  title: "Sakin Sığınak — Kurumsal Psikoloji Birimi",
  description: "Arnavutköy Belediyesi Kurumsal Psikoloji Birimi personel hizmetleri. Randevu alın, testleri doldurun.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f3fbfb",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" className={`${manrope.variable} ${inter.variable}`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen flex flex-col selection:bg-primary-container selection:text-on-primary-container">
        <main className="flex-1 pb-24">
          {children}
        </main>

        <footer className="pb-28 pt-4 px-6 text-center">
          <p className="text-[10px] text-teal-900/30">
            powered by <span className="font-semibold">Uzm. Kl. Psk. Yusuf Pamuk</span>
          </p>
        </footer>

        <BottomNav />
        <Onboarding />
      </body>
    </html>
  )
}
