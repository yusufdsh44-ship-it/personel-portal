"use client"

import { use, useState, useCallback, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { TESTS } from "@/app/lib/test-data"
import { SuccessCheck } from "@/app/components/motion"
import { useTestUser } from "../test-context"

export default function TestSorularPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const test = TESTS[id]

  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [direction, setDirection] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)
  const [controlWarning, setControlWarning] = useState(false)
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const { userInfo } = useTestUser()
  const [briefingDone, setBriefingDone] = useState(false)
  const [briefingStep, setBriefingStep] = useState(0)

  const total = test?.questions.length ?? 0

  const select = useCallback((optIdx: number) => {
    if (!test) return
    const value = test.scale.min + optIdx
    setAnswers(prev => ({ ...prev, [current]: value }))

    if (current < total - 1) {
      if (autoAdvanceTimer.current) clearTimeout(autoAdvanceTimer.current)
      autoAdvanceTimer.current = setTimeout(() => {
        autoAdvanceTimer.current = null
        setDirection(1)
        setCurrent(prev => Math.min(prev + 1, total - 1))
      }, 350)
    }
  }, [current, total, test])

  const goBack = useCallback(() => {
    if (current > 0) {
      if (autoAdvanceTimer.current) { clearTimeout(autoAdvanceTimer.current); autoAdvanceTimer.current = null }
      setDirection(-1)
      setCurrent(prev => prev - 1)
      setControlWarning(false)
    }
  }, [current])

  const goForward = useCallback(() => {
    if (current < total - 1 && answers[current] !== undefined) {
      if (autoAdvanceTimer.current) { clearTimeout(autoAdvanceTimer.current); autoAdvanceTimer.current = null }
      setDirection(1)
      setCurrent(prev => Math.min(prev + 1, total - 1))
      setControlWarning(false)
    }
  }, [current, total, answers])

  // Keyboard navigation
  useEffect(() => {
    if (!test) return
    const handler = (e: KeyboardEvent) => {
      if (done || submitting) return
      if (e.key === "ArrowLeft") goBack()
      if (e.key === "ArrowRight") goForward()
      const num = parseInt(e.key)
      if (!isNaN(num) && num >= test.scale.min && num <= test.scale.max) {
        select(num - test.scale.min)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [test, done, submitting, goBack, goForward, select])


  if (!test) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-on-surface-variant">Test bulunamadı.</p>
      </div>
    )
  }

  const progress = (Object.keys(answers).length / total) * 100
  const allAnswered = Object.keys(answers).length === total

  const dismissBriefing = () => {
    setBriefingDone(true)
  }

  // --- Briefing Screen ---
  if (!briefingDone) {
    const steps = [
      // Adım 1: Test hakkında
      <div key="info" className="flex flex-col items-center text-center px-6">
        <div className="w-16 h-16 rounded-3xl bg-primary-container flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-primary text-3xl">assignment</span>
        </div>
        <h2 className="text-2xl font-headline font-bold text-on-surface tracking-tight mb-2">{test.name}</h2>
        <p className="text-on-surface-variant text-sm mb-6">{test.fullName}</p>
        <div className="grid grid-cols-3 gap-4 w-full max-w-xs mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{total}</div>
            <div className="text-[10px] text-on-surface-variant">Soru</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">{test.estimatedMinutes}</div>
            <div className="text-[10px] text-on-surface-variant">Tahmini</div>
          </div>
          <div className="text-center">
            <span className="material-symbols-outlined text-2xl text-primary">lock</span>
            <div className="text-[10px] text-on-surface-variant">Gizli</div>
          </div>
        </div>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-sm">{test.instruction}</p>
      </div>,

      // Adım 2: Ölçek açıklaması
      <div key="scale" className="flex flex-col items-center text-center px-6">
        <div className="w-16 h-16 rounded-3xl bg-secondary-container flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-secondary text-3xl">tune</span>
        </div>
        <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight mb-2">Yanıt Ölçeği</h2>
        <p className="text-on-surface-variant text-sm mb-6">Her soru için aşağıdaki seçeneklerden birini işaretleyin</p>
        <div className="w-full max-w-xs space-y-2">
          {test.scale.labels.map((label, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-surface-container-low">
              <span className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center text-sm font-bold">
                {test.scale.min + i}
              </span>
              <span className="text-sm font-medium text-on-surface">{label}</span>
            </div>
          ))}
        </div>
      </div>,

      // Adım 3: Kurallar
      <div key="rules" className="flex flex-col items-center text-center px-6">
        <div className="w-16 h-16 rounded-3xl bg-tertiary-container flex items-center justify-center mb-6">
          <span className="material-symbols-outlined text-tertiary text-3xl">checklist</span>
        </div>
        <h2 className="text-xl font-headline font-bold text-on-surface tracking-tight mb-6">Başlamadan Önce</h2>
        <div className="w-full max-w-xs space-y-3 text-left">
          {[
            { icon: "check_circle", text: "Doğru ya da yanlış cevap yoktur" },
            { icon: "check_circle", text: "Hiçbir soruyu atlamayın" },
            { icon: "check_circle", text: "İçgüdüsel yanıtlayın, çok düşünmeyin" },
            { icon: "shield", text: "Sonuçlarınız sadece psikoloğunuz tarafından görülür" },
            { icon: "bookmark", text: "İlerlemeniz otomatik kaydedilir" },
          ].map((rule, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-surface-container-low">
              <span className="material-symbols-outlined text-primary text-lg">{rule.icon}</span>
              <span className="text-sm text-on-surface">{rule.text}</span>
            </div>
          ))}
        </div>
      </div>,
    ]

    return (
      <div className="flex flex-col items-center justify-between h-screen bg-surface px-4 py-8">
        {/* Progress dots */}
        <div className="flex gap-2 pt-4">
          {steps.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === briefingStep ? "bg-primary w-6" : i < briefingStep ? "bg-primary" : "bg-outline-variant/30"}`} />
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={briefingStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center"
          >
            {steps[briefingStep]}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="w-full max-w-xs space-y-3 pb-4">
          {briefingStep < steps.length - 1 ? (
            <button onClick={() => setBriefingStep(s => s + 1)}
              className="w-full py-4 rounded-3xl bg-primary text-on-primary font-bold text-base shadow-lg shadow-black/5 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
              Devam
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          ) : (
            <button onClick={dismissBriefing}
              className="w-full py-4 rounded-3xl bg-primary text-on-primary font-bold text-base shadow-lg shadow-black/5 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2">
              Anladım, Teste Başla
              <span className="material-symbols-outlined">play_arrow</span>
            </button>
          )}
          {briefingStep > 0 && (
            <button onClick={() => setBriefingStep(s => s - 1)}
              className="w-full py-3 text-on-surface-variant text-sm font-medium hover:text-on-surface transition-colors">
              Geri
            </button>
          )}
        </div>
      </div>
    )
  }

  const handleFinish = async () => {
    if (test.controlQuestion) {
      const cq = test.controlQuestion
      if (answers[cq.index] !== cq.expectedValue) {
        setControlWarning(true)
        setDirection(1)
        setCurrent(cq.index)
        return
      }
    }

    if (!userInfo.adSoyad || !userInfo.mudurluk) {
      alert("Oturum bilgileriniz kayboldu. Bilgilerinizi tekrar girmeniz gerekiyor. Cevaplarınız korunacak.")
      router.replace(`/testler/${id}`)
      return
    }

    setSubmitting(true)

    const unanswered = Array.from({ length: total }, (_, i) => i).filter(i => answers[i] === undefined)
    if (unanswered.length > 0) {
      setDirection(1)
      setCurrent(unanswered[0])
      alert(`${unanswered.length} soru cevaplanmamış. Lütfen tüm soruları cevaplayın.`)
      setSubmitting(false)
      return
    }
    const cevaplar = Array.from({ length: total }, (_, i) => answers[i])

    try {
      const res = await fetch("/api/test-sonuc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adSoyad: userInfo.adSoyad,
          mudurluk: userInfo.mudurluk,
          testTuru: test.name,
          cevaplar,
          tarih: new Date().toISOString(),
        }),
      })

      if (!res.ok) throw new Error("Kayıt hatası")
      setDone(true)
    } catch {
      alert("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setSubmitting(false)
    }
  }

  // --- Done Screen ---
  if (done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
        <SuccessCheck />
        <h2 className="text-2xl font-headline font-bold text-on-surface mt-8 mb-2">
          Testiniz Kaydedildi
        </h2>
        <p className="text-on-surface-variant text-sm mb-6 max-w-sm">
          Psikoloğunuz sonuçlarınızı inceleyecek ve görüşmenizde birlikte değerlendireceksiniz.
        </p>

        {/* Özet kutu */}
        <div className="rounded-2xl bg-primary/[0.04] border border-primary/10 p-5 w-full max-w-sm text-left space-y-3 mb-8">
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Test</span>
            <span className="font-semibold text-on-surface">{test.name} — {test.fullName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Yanıtlanan</span>
            <span className="font-semibold text-on-surface">{total} / {total} soru</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-on-surface-variant">Tarih</span>
            <span className="font-semibold text-on-surface">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
          </div>
        </div>

        <button
          onClick={() => router.push("/testler")}
          className="px-8 py-4 rounded-2xl bg-primary text-on-primary font-bold shadow-lg shadow-black/5 hover:opacity-90 active:scale-95 transition-all"
        >
          Testler Sayfasına Dön
        </button>
      </div>
    )
  }

  const selectedValue = answers[current]
  const selectedIdx = selectedValue !== undefined ? selectedValue - test.scale.min : -1
  return (
    <>
      {/* Header */}
      <header className="bg-surface-container-low/80 backdrop-blur-md fixed top-0 w-full z-50 shadow-sm shadow-black/5">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              disabled={current === 0}
              className="text-on-surface hover:opacity-80 active:scale-95 disabled:opacity-30 transition-all"
            >
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h1 className="text-on-surface font-bold text-lg font-headline tracking-tight">
              {test.name}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-on-surface-variant text-xs font-medium tabular-nums">
              {current + 1} / {total}
            </span>
          </div>
        </div>
        <div className="w-full h-1 bg-surface-container-highest">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      {/* Main */}
      <main className="pt-24 pb-32 px-6 flex flex-col items-center max-w-lg mx-auto w-full">
        {/* Control question warning */}
        {controlWarning && current === test.controlQuestion?.index && (
          <div className="w-full mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            {test.controlQuestion.message}
          </div>
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.section
            key={current}
            initial={{ opacity: 0, x: direction * 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -30 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="w-full mt-8 mb-8"
          >
            {test.prefix && (
              <div className="mb-3">
                <span className="text-xs text-on-surface-variant font-medium italic">
                  {test.prefix}
                </span>
              </div>
            )}

            <div className="mb-4">
              <span className="inline-block px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-[10px] font-bold font-mono tracking-wider uppercase">
                Soru {current + 1}
              </span>
            </div>

            <h2 className="text-2xl md:text-3xl font-headline font-bold text-on-surface leading-tight tracking-tight">
              {test.questions[current]}
            </h2>

            <div className="w-full space-y-3 mt-10">
              {test.scale.labels.map((label, i) => {
                const isSelected = selectedIdx === i
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => select(i)}
                    className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-200 active:scale-[0.98] ${
                      isSelected
                        ? "bg-primary-container text-on-primary-container shadow-sm"
                        : "bg-surface-container-low hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold w-5 text-center ${isSelected ? "text-primary" : "text-outline"}`}>
                        {test.scale.min + i}
                      </span>
                      <span className={`text-base ${isSelected ? "font-bold" : "font-medium text-on-surface"}`}>
                        {label}
                      </span>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                        isSelected ? "border-primary bg-white" : "border-outline-variant"
                      }`}
                    >
                      {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                    </div>
                  </button>
                )
              })}
            </div>
          </motion.section>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex w-full gap-3 mt-4">
          <button
            onClick={goBack}
            disabled={current === 0}
            className="flex-1 py-4 px-6 rounded-2xl bg-secondary-container text-on-surface-variant font-headline font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-30"
          >
            Geri
          </button>

          {current === total - 1 ? (
            <button
              onClick={handleFinish}
              disabled={!allAnswered || submitting}
              className="flex-1 py-4 px-6 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm shadow-lg shadow-black/5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            >
              {submitting ? "Kaydediliyor..." : allAnswered ? "Testi Bitir" : `${total - Object.keys(answers).length} soru kaldı`}
            </button>
          ) : (
            <button
              onClick={goForward}
              disabled={answers[current] === undefined}
              className="flex-1 py-4 px-6 rounded-2xl bg-primary text-on-primary font-headline font-bold text-sm shadow-lg shadow-black/5 transition-all hover:opacity-90 active:scale-95 disabled:opacity-40"
            >
              Sonraki
            </button>
          )}
        </div>

        {current === total - 1 && !allAnswered && (
          <p className="text-xs text-on-surface-variant mt-4 text-center">
            Tüm soruları cevaplamanız gerekmektedir. Cevaplanmamış sorulara geri dönebilirsiniz.
          </p>
        )}
      </main>
    </>
  )
}
