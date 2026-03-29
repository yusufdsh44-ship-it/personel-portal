"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "../../components/header"
import { FadeIn, FadeInView, PulseGlow, motion } from "../../components/motion"
import { TESTS, MUDURLUKLER } from "@/app/lib/test-data"
import { MudurlukSelect } from "@/app/components/mudurluk-select"

export default function TestGirisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const test = TESTS[id]

  const [adSoyad, setAdSoyad] = useState("")
  const [mudurluk, setMudurluk] = useState("")
  const [error, setError] = useState("")

  if (!test) {
    return (
      <>
        <Header />
        <div className="pt-24 px-6 text-center">
          <p className="text-on-surface-variant">Test bulunamadı.</p>
        </div>
      </>
    )
  }

  const handleStart = () => {
    if (!adSoyad.trim()) {
      setError("Lütfen adınızı ve soyadınızı giriniz.")
      return
    }
    if (!mudurluk) {
      setError("Lütfen bağlı olduğunuz müdürlüğü seçiniz.")
      return
    }
    setError("")
    sessionStorage.setItem("test_adSoyad", adSoyad.trim())
    sessionStorage.setItem("test_mudurluk", mudurluk)
    router.push(`/testler/${id}/sorular`)
  }

  return (
    <>
      <Header />
      <div className="pt-24 px-6 max-w-md mx-auto pb-12">
        <FadeIn>
        <section className="mb-10 text-center">
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="mb-6 inline-block p-4 bg-primary-container rounded-3xl"
          >
            <span className="material-symbols-outlined text-primary text-4xl filled">assignment</span>
          </motion.div>
          <h2 className="text-3xl font-extrabold text-on-surface tracking-tight mb-2">
            {test.name}
          </h2>
          <p className="text-on-surface-variant text-xs font-medium mb-4">{test.fullName}</p>
          <div className="rounded-2xl bg-primary/[0.04] border border-primary/10 px-5 py-4 mt-2 text-left">
            <p className="text-sm leading-relaxed text-on-surface">
              {test.instruction.split('. ').map((sentence, i, arr) => {
                const isLast = i === arr.length - 1
                const text = isLast ? sentence : sentence + '. '
                if (i === 0) return <span key={i} className="font-semibold text-primary">{text}</span>
                return <span key={i}>{text}</span>
              })}
            </p>
            <p className="text-xs text-on-surface-variant mt-3 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-primary/60">info</span>
              Doğru ya da yanlış cevap yoktur. Lütfen tüm maddeleri yanıtlayınız.
            </p>
          </div>
        </section>
        </FadeIn>

        <div className="space-y-8">
          <FadeInView>
          <div className="bg-surface-lowest p-8 rounded-3xl shadow-[0_20px_50px_rgba(41,104,104,0.05)] border border-outline-variant/10">
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-primary mb-2 ml-1 tracking-widest uppercase">
                  Ad Soyad
                </label>
                <input
                  className="w-full bg-surface-container-high/40 border-none rounded-2xl px-5 py-4 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  placeholder="Adınızı ve soyadınızı giriniz"
                  type="text"
                  value={adSoyad}
                  onChange={(e) => setAdSoyad(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-primary mb-2 ml-1 tracking-widest uppercase">
                  Bağlı Olduğunuz Müdürlük / Birim
                </label>
                <MudurlukSelect value={mudurluk} onChange={setMudurluk} />
              </div>
            </div>
          </div>
          </FadeInView>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {error}
            </div>
          )}

          <FadeInView delay={0.1}>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-tertiary-container/30 p-4 rounded-2xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-tertiary mb-1.5">schedule</span>
              <span className="text-[9px] font-bold text-tertiary uppercase tracking-tighter">Tahmini Süre</span>
              <span className="text-sm font-semibold text-on-surface">{test.estimatedMinutes}</span>
              <span className="text-[8px] text-on-surface-variant mt-0.5 leading-tight">Çoğu kişi bu sürede tamamlıyor</span>
            </div>
            <div className="bg-secondary-container/30 p-4 rounded-2xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-secondary mb-1.5">quiz</span>
              <span className="text-[9px] font-bold text-secondary uppercase tracking-tighter">Soru</span>
              <span className="text-sm font-semibold text-on-surface">{test.questions.length}</span>
            </div>
            <div className="bg-primary-container/30 p-4 rounded-2xl flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-primary mb-1.5">lock_person</span>
              <span className="text-[9px] font-bold text-primary uppercase tracking-tighter">Güvenlik</span>
              <span className="text-sm font-semibold text-on-surface">Kişiye Özel</span>
            </div>
          </div>

          </FadeInView>

          <FadeInView delay={0.2}>
          <PulseGlow>
            <motion.button
              onClick={handleStart}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary hover:opacity-90 transition-all duration-300 py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-primary/20"
            >
              <span className="text-on-primary font-bold text-lg">Teste Başla</span>
              <motion.span
                whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="material-symbols-outlined text-on-primary"
              >arrow_forward</motion.span>
            </motion.button>
          </PulseGlow>
          </FadeInView>
        </div>
      </div>
    </>
  )
}
