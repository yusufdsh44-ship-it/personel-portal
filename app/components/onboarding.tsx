"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

const CHECKLIST = [
  "Psikolojik testleri doldurun",
  "Randevu talebinizi oluşturun",
  "Onay sonrası görüşmenize gelin",
]

export function Onboarding() {
  const [show, setShow] = useState<boolean | null>(null)
  const [step, setStep] = useState(0)

  useEffect(() => {
    const done = localStorage.getItem("onboarding_done") === "1"
    setShow(!done)
  }, [])

  if (!show) return null

  const finish = () => {
    localStorage.setItem("onboarding_done", "1")
    setShow(false)
  }

  const isLast = step === 2

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-surface w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-8 pb-10 space-y-6 shadow-2xl"
      >
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {[0, 1, 2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? "w-8 bg-primary" : "w-2 bg-outline-variant/30"}`} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.2 }}
            className="text-center space-y-5"
          >
            {/* Adım 1: Tanıtım */}
            {step === 0 && (
              <>
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-primary text-4xl filled">psychology</span>
                </div>
                <h2 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">
                  Psikolojik Destek Hizmetiniz
                </h2>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Arnavutköy Belediyesi personeli olarak size özel psikolojik destek hizmetinden faydalanabilirsiniz. Tüm hizmetler ücretsizdir.
                </p>
              </>
            )}

            {/* Adım 2: Nasıl çalışır — tikli checklist */}
            {step === 1 && (
              <>
                <div className="w-20 h-20 rounded-3xl bg-tertiary-container/40 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-tertiary text-4xl filled">route</span>
                </div>
                <h2 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">
                  Nasıl Çalışır?
                </h2>
                <div className="space-y-3 text-left max-w-xs mx-auto pt-2">
                  {CHECKLIST.map((item, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, duration: 0.3 }}
                      className="flex items-start gap-3"
                    >
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="material-symbols-outlined text-on-primary text-base filled">check</span>
                      </div>
                      <span className="text-sm text-on-surface font-medium leading-relaxed pt-0.5">{item}</span>
                    </motion.div>
                  ))}
                </div>
              </>
            )}

            {/* Adım 3: Gizlilik — sade mesaj */}
            {step === 2 && (
              <>
                <div className="w-20 h-20 rounded-3xl bg-green-50 flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-green-700 text-4xl filled">shield</span>
                </div>
                <h2 className="text-xl font-headline font-extrabold text-on-surface tracking-tight">
                  Gizlilik Garantisi
                </h2>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  Görüşmeleriniz etik kurallar çerçevesinde sadece psikoloğunuz ile aranızda kalır.
                </p>
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-3">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)}
              className="flex-1 py-3.5 rounded-2xl bg-surface-container text-on-surface-variant font-semibold text-sm active:scale-95 transition-all">
              Geri
            </button>
          )}
          <button onClick={isLast ? finish : () => setStep(step + 1)}
            className="flex-1 py-3.5 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-lg shadow-primary/20 active:scale-95 transition-all">
            {isLast ? "Başlayalım" : "Devam"}
          </button>
        </div>

        <button onClick={finish} className="block mx-auto text-xs text-on-surface-variant/60 hover:text-on-surface-variant">
          Atla
        </button>
      </motion.div>
    </div>
  )
}
