"use client"

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { motion, AnimatePresence, PulseGlow } from "./motion"

// ─── Types ─────────────────────────────────────────────────
type Platform = "ios-safari" | "ios-other" | "android" | "desktop"

// ─── Hook ──────────────────────────────────────────────────
function usePwaInstall() {
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null)
  const [platform, setPlatform] = useState<Platform>("desktop")
  const [isStandalone, setIsStandalone] = useState(false)
  const [canPrompt, setCanPrompt] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const ua = navigator.userAgent
    let p: Platform = "desktop"
    const isIos = /iPhone|iPad|iPod/.test(ua) || (navigator.maxTouchPoints > 1 && /Macintosh/.test(ua))
    if (isIos) {
      p = /CriOS|FxiOS|EdgiOS/.test(ua) ? "ios-other" : "ios-safari"
    } else if (/Android/.test(ua)) {
      p = "android"
    }

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true ||
      localStorage.getItem("pwa_installed") === "1"

    setPlatform(p)
    setIsStandalone(standalone)
    setDismissed(localStorage.getItem("pwa_guide_dismissed") === "1")
    setReady(true)
  }, [])

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      promptRef.current = e as BeforeInstallPromptEvent
      setCanPrompt(true)
    }
    window.addEventListener("beforeinstallprompt", handler)
    return () => window.removeEventListener("beforeinstallprompt", handler)
  }, [])

  const triggerInstall = useCallback(async () => {
    if (!promptRef.current) return
    promptRef.current.prompt()
    const result = await promptRef.current.userChoice
    if (result.outcome === "accepted") {
      localStorage.setItem("pwa_installed", "1")
      setIsStandalone(true)
    }
    promptRef.current = null
    setCanPrompt(false)
  }, [])

  const handleButtonClick = useCallback(() => {
    if (canPrompt) {
      triggerInstall()
    } else {
      setShowGuide(true)
    }
  }, [canPrompt, triggerInstall])

  const closeGuide = useCallback(() => {
    localStorage.setItem("pwa_guide_dismissed", "1")
    setShowGuide(false)
    setDismissed(true)
  }, [])

  return { platform, isStandalone, canPrompt, showGuide, dismissed, ready, handleButtonClick, closeGuide }
}

// ─── beforeinstallprompt type ──────────────────────────────
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

// ─── Shared ────────────────────────────────────────────────
function TapHint({ label = "Buraya dokunun" }: { label?: string }) {
  return (
    <motion.div
      className="flex items-center justify-center gap-1.5 mt-3"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <span className="material-symbols-outlined text-primary text-xl filled">touch_app</span>
      <span className="text-xs font-bold text-primary">{label}</span>
    </motion.div>
  )
}

function Highlight({ children, round = false }: { children: ReactNode; round?: boolean }) {
  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${round ? "rounded-full" : "rounded-xl"}`}
      animate={{
        boxShadow: [
          "0 0 0 0 rgba(181,105,77,0.4)",
          "0 0 0 8px rgba(181,105,77,0)",
          "0 0 0 0 rgba(181,105,77,0)",
        ],
      }}
      transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  )
}

// ─── iOS Safari Steps ──────────────────────────────────────
function IosSafariStep1() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">Paylaş butonuna dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Safari&apos;nin alt çubuğundaki paylaş simgesini bulun</p>
      </div>

      <div className="mx-auto max-w-[280px]">
        {/* Mini page preview */}
        <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30">
          <div className="bg-white rounded-xl h-24 mb-3 flex items-center justify-center border border-outline-variant/20">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary/20 text-3xl">language</span>
              <p className="text-[10px] text-on-surface-variant/30 mt-0.5">kurumsalpsikoloji.com</p>
            </div>
          </div>

          {/* Safari toolbar */}
          <div className="bg-white rounded-xl px-3 py-2.5 flex items-center justify-between border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-lg">arrow_back_ios</span>
            <span className="material-symbols-outlined text-on-surface-variant/30 text-lg">arrow_forward_ios</span>

            <Highlight round>
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">ios_share</span>
              </div>
            </Highlight>

            <span className="material-symbols-outlined text-on-surface-variant/30 text-lg">menu_book</span>
            <span className="material-symbols-outlined text-on-surface-variant/30 text-lg">filter_none</span>
          </div>
        </div>

        <TapHint />
      </div>
    </div>
  )
}

function IosSafariStep2() {
  const items = [
    { icon: "content_copy", label: "Kopyala" },
    { icon: "chat_bubble_outline", label: "Mesaj Gönder" },
    { icon: "add_box", label: "Ana Ekrana Ekle", active: true },
    { icon: "bookmark_add", label: "Yer İmi Ekle" },
  ]

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">&quot;Ana Ekrana Ekle&quot;ye dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Listede aşağı kaydırarak bu seçeneği bulun</p>
      </div>

      <div className="mx-auto max-w-[280px]">
        <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 border-b border-outline-variant/15 last:border-0 transition-colors ${
                item.active ? "bg-primary/8" : ""
              }`}
            >
              {item.active ? (
                <Highlight>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-lg">{item.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-primary">{item.label}</span>
                  </div>
                </Highlight>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-surface-variant/50 text-lg">{item.icon}</span>
                  </div>
                  <span className="text-sm text-on-surface-variant/60">{item.label}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <TapHint />
      </div>
    </div>
  )
}

function IosSafariStep3() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">&quot;Ekle&quot; butonuna dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Uygulamayı ana ekranınıza eklemek için onaylayın</p>
      </div>

      <div className="mx-auto max-w-[280px]">
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
          {/* App preview */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-primary text-2xl filled">psychology</span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">Psikoloji</p>
              <p className="text-[11px] text-on-surface-variant">kurumsalpsikoloji.com</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button type="button" className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-sm font-medium">
              Vazgeç
            </button>
            <Highlight>
              <button type="button" className="px-8 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold">
                Ekle
              </button>
            </Highlight>
          </div>
        </div>

        <TapHint />
      </div>
    </div>
  )
}

// ─── Android Steps ─────────────────────────────────────────
function AndroidStep1() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">Menü butonuna dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Chrome&apos;un sağ üstündeki üç nokta menüsünü açın</p>
      </div>

      <div className="mx-auto max-w-[280px]">
        <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30">
          {/* Chrome address bar */}
          <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 border border-outline-variant/20 mb-3">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-base">lock</span>
            <span className="text-xs text-on-surface-variant/50 flex-1 truncate">kurumsalpsikoloji.com</span>
            <Highlight round>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">more_vert</span>
              </div>
            </Highlight>
          </div>

          {/* Page placeholder */}
          <div className="bg-white rounded-xl h-24 flex items-center justify-center border border-outline-variant/20">
            <div className="text-center">
              <span className="material-symbols-outlined text-primary/20 text-3xl">language</span>
              <p className="text-[10px] text-on-surface-variant/30 mt-0.5">kurumsalpsikoloji.com</p>
            </div>
          </div>
        </div>

        <TapHint />
      </div>
    </div>
  )
}

function AndroidStep2() {
  const items = [
    { icon: "star_outline", label: "Yer İşareti Ekle" },
    { icon: "download", label: "İndir" },
    { icon: "install_mobile", label: "Uygulamayı Yükle", active: true },
    { icon: "info_outline", label: "Sayfa Bilgisi" },
  ]

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">&quot;Uygulamayı Yükle&quot;ye dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Açılan menüden bu seçeneği bulun</p>
      </div>

      <div className="mx-auto max-w-[280px]">
        <div className="bg-white rounded-2xl border border-outline-variant/30 overflow-hidden shadow-sm">
          {items.map((item, i) => (
            <div
              key={i}
              className={`flex items-center gap-3 px-4 py-3 border-b border-outline-variant/15 last:border-0 ${
                item.active ? "bg-primary/8" : ""
              }`}
            >
              {item.active ? (
                <Highlight>
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                    <span className="text-sm font-bold text-primary">{item.label}</span>
                  </div>
                </Highlight>
              ) : (
                <>
                  <span className="material-symbols-outlined text-on-surface-variant/50 text-xl">{item.icon}</span>
                  <span className="text-sm text-on-surface-variant/60">{item.label}</span>
                </>
              )}
            </div>
          ))}
        </div>

        <TapHint />
      </div>
    </div>
  )
}

// ─── Desktop Steps ─────────────────────────────────────────
function DesktopStep1() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">Yükle simgesine tıklayın</h3>
        <p className="text-on-surface-variant text-sm mt-1">Adres çubuğunun sağ tarafındaki simgeyi bulun</p>
      </div>

      <div className="mx-auto max-w-sm">
        <div className="bg-surface-container rounded-2xl p-3 border border-outline-variant/30">
          <div className="bg-white rounded-xl px-3 py-2 flex items-center gap-2 border border-outline-variant/20">
            <span className="material-symbols-outlined text-on-surface-variant/30 text-base">lock</span>
            <span className="text-xs text-on-surface-variant/50 flex-1 truncate">kurumsalpsikoloji.com</span>
            <Highlight round>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-lg">install_desktop</span>
              </div>
            </Highlight>
          </div>
        </div>

        <TapHint label="Buraya tıklayın" />
      </div>
    </div>
  )
}

function DesktopStep2() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">&quot;Yükle&quot; butonuna tıklayın</h3>
        <p className="text-on-surface-variant text-sm mt-1">Açılan pencerede yüklemeyi onaylayın</p>
      </div>

      <div className="mx-auto max-w-[280px]">
        <div className="bg-white rounded-2xl border border-outline-variant/30 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-xl filled">psychology</span>
            </div>
            <div>
              <p className="font-bold text-on-surface text-sm">Psikoloji Birimi</p>
              <p className="text-[11px] text-on-surface-variant">kurumsalpsikoloji.com</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" className="flex-1 py-2.5 rounded-xl bg-surface-container text-on-surface-variant text-sm font-medium">
              Vazgeç
            </button>
            <Highlight>
              <button type="button" className="px-8 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold">
                Yükle
              </button>
            </Highlight>
          </div>
        </div>

        <TapHint label="Buraya tıklayın" />
      </div>
    </div>
  )
}

// ─── iOS Non-Safari Warning ────────────────────────────────
function IosOtherWarning({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText("https://www.kurumsalpsikoloji.com")
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback: select a hidden input
    }
  }

  return (
    <div className="text-center space-y-5 py-2">
      <div className="w-20 h-20 rounded-3xl bg-amber-50 flex items-center justify-center mx-auto">
        <span className="material-symbols-outlined text-amber-600 text-4xl">warning</span>
      </div>
      <h3 className="font-headline font-bold text-on-surface text-lg">Safari Gerekli</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">
        Uygulamayı yüklemek için <strong className="text-on-surface">Safari</strong> tarayıcısını
        kullanmanız gerekmektedir. Aşağıdaki butona dokunarak adresi kopyalayın,
        ardından Safari&apos;de yapıştırıp açın.
      </p>
      <button
        onClick={copyUrl}
        className="w-full py-3 rounded-2xl bg-primary text-on-primary font-bold text-sm active:scale-95 transition-all"
      >
        {copied ? "Kopyalandı!" : "Adresi Kopyala"}
      </button>
      <button onClick={onClose} className="block mx-auto text-xs text-on-surface-variant/60">
        Kapat
      </button>
    </div>
  )
}

// ─── Step Registry ─────────────────────────────────────────
const STEPS: Record<string, React.FC[]> = {
  "ios-safari": [IosSafariStep1, IosSafariStep2, IosSafariStep3],
  android: [AndroidStep1, AndroidStep2],
  desktop: [DesktopStep1, DesktopStep2],
}

const SUBTITLES: Record<string, string> = {
  "ios-safari": "Mağazaya gerek yok — 3 kolay adımda telefonunuza ekleyin",
  android: "Mağazaya gerek yok — 2 adımda telefonunuza ekleyin",
  desktop: "Tarayıcınızdan bilgisayarınıza yükleyin",
}

// ─── Guide Modal ───────────────────────────────────────────
function PwaInstallGuide({ platform, onClose }: { platform: Platform; onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)

  const steps = STEPS[platform] || []
  const totalSteps = steps.length
  const isLast = step === totalSteps - 1
  const StepComponent = steps[step]

  const goNext = () => { setDir(1); setStep(s => Math.min(s + 1, totalSteps - 1)) }
  const goPrev = () => { setDir(-1); setStep(s => Math.max(s - 1, 0)) }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 flex items-end sm:items-center justify-center" onClick={onClose}>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-surface w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-6 pb-8 shadow-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-lg">install_mobile</span>
            </div>
            <span className="font-headline font-bold text-on-surface text-sm">Uygulamayı Yükle</span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center active:scale-90 transition-transform"
          >
            <span className="material-symbols-outlined text-on-surface-variant text-lg">close</span>
          </button>
        </div>

        {platform === "ios-other" ? (
          <IosOtherWarning onClose={onClose} />
        ) : (
          <div className="space-y-4 mt-3">
            {/* Subtitle */}
            <p className="text-center text-xs text-on-surface-variant">{SUBTITLES[platform]}</p>

            {/* Progress dots */}
            {totalSteps > 1 && (
              <div className="flex justify-center gap-2">
                {steps.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === step ? "w-8 bg-primary" : "w-2 bg-outline-variant/30"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Step content with transitions */}
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: dir * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -30 }}
                transition={{ duration: 0.2 }}
              >
                {StepComponent && <StepComponent />}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex gap-3 pt-1">
              {step > 0 && (
                <button
                  onClick={goPrev}
                  className="flex-1 py-3 rounded-2xl bg-surface-container text-on-surface-variant font-semibold text-sm active:scale-95 transition-all"
                >
                  Geri
                </button>
              )}
              <button
                onClick={isLast ? onClose : goNext}
                className="flex-1 py-3 rounded-2xl bg-primary text-on-primary font-bold text-sm active:scale-95 transition-all"
              >
                {isLast ? "Anladım" : "Sonraki"}
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────
export function PwaInstall() {
  const { platform, isStandalone, showGuide, dismissed, ready, handleButtonClick, closeGuide } = usePwaInstall()

  if (!ready || isStandalone) return null

  return (
    <>
      {/* Floating install button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1.5 }}
        className="fixed bottom-28 left-5 z-40"
      >
        {dismissed ? (
          <button
            onClick={handleButtonClick}
            aria-label="Uygulamayı yükle"
            className="w-11 h-11 rounded-full bg-primary/80 text-on-primary shadow-md flex items-center justify-center active:scale-90 transition-all"
          >
            <span className="material-symbols-outlined text-lg">install_mobile</span>
          </button>
        ) : (
          <PulseGlow className="rounded-full">
            <button
              onClick={handleButtonClick}
              aria-label="Uygulamayı yükle"
              className="flex items-center gap-1.5 pl-3 pr-4 py-2.5 rounded-full bg-primary text-on-primary shadow-lg shadow-black/10 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-lg">install_mobile</span>
              <span className="text-xs font-bold tracking-wide">Yükle</span>
            </button>
          </PulseGlow>
        )}
      </motion.div>

      {/* Guide modal */}
      <AnimatePresence>
        {showGuide && <PwaInstallGuide platform={platform} onClose={closeGuide} />}
      </AnimatePresence>
    </>
  )
}
