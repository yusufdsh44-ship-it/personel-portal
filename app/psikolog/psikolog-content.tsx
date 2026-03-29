"use client"

import { Header } from "../components/header"
import { HeroSection } from "./components/hero-section"
import { CtaSection } from "./components/cta-section"
import { MesajForm } from "../components/mesaj-form"

export function PsikologContent() {
  return (
    <>
      <Header
        title="Kurumsal Psikoloji Birimi"
        
      />

      <HeroSection />

      {/* Alt bölümler — uyumlu grid */}
      <div className="max-w-2xl mx-auto px-6 pb-12 pt-4 space-y-3">
        <MesajForm />

        <CtaSection />
      </div>
    </>
  )
}
