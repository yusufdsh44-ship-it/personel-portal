"use client"

import { useState, useEffect, useRef, useCallback, type ReactNode } from "react"
import { usePathname } from "next/navigation"
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

// ─── iOS-realistic wrapper ─────────────────────────────────
function IosMockup({ children }: { children: ReactNode }) {
  return (
    <div
      className="mx-auto max-w-[300px] rounded-2xl overflow-hidden border border-[#d1d1d6] shadow-md"
      style={{ fontFamily: "-apple-system, system-ui, sans-serif" }}
    >
      {children}
    </div>
  )
}

// ─── iOS Safari Steps ──────────────────────────────────────
function IosSafariStep1() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">Paylaş&apos;a dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Alttaki bu simgeye dokunun</p>
      </div>

      <IosMockup>
        {/* Simulated page area */}
        <div className="bg-white h-28 flex items-center justify-center">
          <div className="text-center opacity-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-96.png" alt="" className="w-10 h-10 mx-auto rounded-lg" />
            <p className="text-[10px] text-[#8e8e93] mt-1">kurumsalpsikoloji.com</p>
          </div>
        </div>

        {/* Safari bottom bar — iOS 15+ style */}
        <div className="bg-[#f2f2f7] border-t border-[#c6c6c8]">
          {/* URL bar */}
          <div className="mx-3 mt-2 mb-2 bg-white/80 rounded-xl px-3 py-1.5 text-center">
            <span className="text-[13px] text-[#8e8e93]">kurumsalpsikoloji.com</span>
          </div>
          {/* Toolbar icons */}
          <div className="flex items-center justify-around px-4 pb-2 pt-0.5">
            <span className="material-symbols-outlined text-[#007aff] text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
              arrow_back_ios
            </span>
            <span className="material-symbols-outlined text-[#c7c7cc] text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
              arrow_forward_ios
            </span>

            {/* Share — highlighted */}
            <Highlight round>
              <div className="w-10 h-10 rounded-full bg-[#007aff]/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#007aff] text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
                  ios_share
                </span>
              </div>
            </Highlight>

            <span className="material-symbols-outlined text-[#007aff] text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
              menu_book
            </span>
            <span className="material-symbols-outlined text-[#007aff] text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
              filter_none
            </span>
          </div>
        </div>
      </IosMockup>

      <TapHint />
    </div>
  )
}

function IosSafariStep2() {
  const actions = [
    { icon: "link", label: "Bağlantıyı Kopyala" },
    { icon: "add_box", label: "Ana Ekrana Ekle", active: true },
    { icon: "bookmark_add", label: "Sık Kullanılanlara Ekle" },
    { icon: "chrome_reader_mode", label: "Okuma Listesine Ekle" },
  ]

  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">&quot;Ana Ekrana Ekle&quot;ye dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Listeden bu seçeneği bulun</p>
      </div>

      <IosMockup>
        {/* Share sheet grab handle */}
        <div className="bg-[#f2f2f7] pt-2 pb-3 px-4">
          <div className="w-9 h-1 rounded-full bg-[#c6c6c8] mx-auto mb-3" />

          {/* Page info */}
          <div className="flex items-center gap-2.5 mb-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-96.png" alt="" className="w-10 h-10 rounded-lg" />
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-medium text-black truncate">Kurumsal Psikoloji Birimi</p>
              <p className="text-[13px] text-[#8e8e93] truncate">kurumsalpsikoloji.com</p>
            </div>
          </div>
        </div>

        {/* Action list */}
        <div className="bg-white">
          {actions.map((item, i) => (
            <div key={i} className={`relative ${item.active ? "bg-[#007aff]/8" : ""}`}>
              {item.active && (
                <Highlight>
                  <div className="flex items-center gap-3 px-4 py-3 w-full">
                    <span className="material-symbols-outlined text-[#007aff] text-[22px]">{item.icon}</span>
                    <span className="text-[15px] font-semibold text-[#007aff]">{item.label}</span>
                  </div>
                </Highlight>
              )}
              {!item.active && (
                <div className="flex items-center gap-3 px-4 py-3">
                  <span className="material-symbols-outlined text-[#8e8e93] text-[22px]">{item.icon}</span>
                  <span className="text-[15px] text-black/70">{item.label}</span>
                </div>
              )}
              {i < actions.length - 1 && <div className="ml-14 border-b border-[#c6c6c8]/40" />}
            </div>
          ))}
        </div>
      </IosMockup>

      <TapHint />
    </div>
  )
}

function IosSafariStep3() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">&quot;Ekle&quot;ye dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Sağ üstteki mavi yazıya dokunun — bu kadar!</p>
      </div>

      <IosMockup>
        {/* iOS Navigation bar — exact match of the screenshot */}
        <div className="bg-[#f9f9f9] border-b border-[#c6c6c8]/60 px-4 py-3 flex items-center justify-between">
          <span className="text-[17px] text-[#007aff]">Vazgeç</span>
          <span className="text-[17px] font-semibold text-black">Ana Ekrana Ekle</span>
          <Highlight>
            <span className="text-[17px] font-semibold text-[#007aff] px-1">Ekle</span>
          </Highlight>
        </div>

        {/* Content area — matches the real iOS dialog */}
        <div className="bg-white px-4 pt-4 pb-6">
          <div className="flex items-center gap-3 mb-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="" className="w-14 h-14 rounded-[14px] shadow-sm border border-black/5" />
            <div className="min-w-0 flex-1">
              <p className="text-[17px] text-black">Psikoloji</p>
              <p className="text-[13px] text-[#8e8e93] truncate">https://www.kurumsalpsikoloji.com/</p>
            </div>
          </div>
          <p className="text-[13px] text-[#8e8e93] leading-relaxed">
            Ana ekranınıza, bu web sitesine kolayca erişebilmeniz için bir simge eklenir.
          </p>
        </div>
      </IosMockup>

      <TapHint />
    </div>
  )
}

// ─── Android Steps ─────────────────────────────────────────
function AndroidStep1() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">Üç noktaya dokunun</h3>
        <p className="text-on-surface-variant text-sm mt-1">Sağ üstteki menüyü açın</p>
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
        <p className="text-on-surface-variant text-sm mt-1">Bu seçeneğe dokunun — bu kadar!</p>
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
        <h3 className="font-headline font-bold text-on-surface text-lg">Bu simgeye tıklayın</h3>
        <p className="text-on-surface-variant text-sm mt-1">Adres çubuğunun sağında</p>
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
        <h3 className="font-headline font-bold text-on-surface text-lg">&quot;Yükle&quot;ye tıklayın</h3>
        <p className="text-on-surface-variant text-sm mt-1">Bu kadar!</p>
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
      <h3 className="font-headline font-bold text-on-surface text-lg">Safari&apos;den açın</h3>
      <p className="text-on-surface-variant text-sm leading-relaxed">
        Bu özellik sadece <strong className="text-on-surface">Safari</strong>&apos;de çalışır.
        Adresi kopyalayıp Safari&apos;de açın.
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
// ─── Final "Done" Step ────────────────────────────────────
function DoneStep() {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="font-headline font-bold text-on-surface text-lg">Hazır!</h3>
        <p className="text-on-surface-variant text-sm mt-1">Ana ekranınızda bu şekilde görünecek</p>
      </div>
      <div className="flex justify-center py-4">
        <div className="flex flex-col items-center gap-2">
          <div className="w-16 h-16 rounded-[18px] bg-white shadow-lg border border-black/5 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/icon-192.png" alt="" className="w-14 h-14 rounded-[14px]" />
          </div>
          <span className="text-xs font-medium text-on-surface">Psikoloji</span>
        </div>
      </div>
    </div>
  )
}

const STEPS: Record<string, React.FC[]> = {
  "ios-safari": [IosSafariStep1, IosSafariStep2, IosSafariStep3, DoneStep],
  android: [AndroidStep1, AndroidStep2, DoneStep],
  desktop: [DesktopStep1, DesktopStep2, DoneStep],
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
            <span className="font-headline font-bold text-on-surface text-sm">Uygulamayı İndir</span>
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
  const pathname = usePathname()
  const isPsikolog = pathname === "/" || pathname === "/psikolog"
  const [expanded, setExpanded] = useState(true)
  const [cyclesDone, setCyclesDone] = useState(false)

  // Psikolog sayfasında 3 kez aç-kapa, sonra ikon
  useEffect(() => {
    if (!isPsikolog) { setExpanded(false); setCyclesDone(true); return }
    let count = 0
    const collapse = setTimeout(() => setExpanded(false), 3000)
    const interval = setInterval(() => {
      count++
      if (count >= 3) { clearInterval(interval); setCyclesDone(true); return }
      setExpanded(true)
      setTimeout(() => setExpanded(false), 3000)
    }, 8000)
    return () => { clearTimeout(collapse); clearInterval(interval) }
  }, [isPsikolog])

  if (!ready || isStandalone || !isPsikolog) return null

  const showText = expanded && !cyclesDone

  return (
    <>
      {/* Floating install button — sadece psikolog sayfasında */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 1.5 }}
        className="fixed top-4 right-4 z-40"
      >
        <motion.button
          onClick={handleButtonClick}
          aria-label="Uygulamayı indir"
          className="h-11 rounded-full bg-primary text-on-primary shadow-lg shadow-black/10 flex items-center gap-1.5 overflow-hidden active:scale-95 transition-transform"
          animate={{ width: showText ? 180 : 44 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <span className="material-symbols-outlined text-lg shrink-0 ml-[11px]">install_mobile</span>
          <motion.span
            className="text-xs font-bold tracking-wide whitespace-nowrap pr-4"
            animate={{ opacity: showText ? 1 : 0 }}
            transition={{ duration: 0.3, delay: showText ? 0.15 : 0 }}
          >
            Uygulamayı İndir
          </motion.span>
        </motion.button>
      </motion.div>

      {/* Guide modal */}
      <AnimatePresence>
        {showGuide && <PwaInstallGuide platform={platform} onClose={closeGuide} />}
      </AnimatePresence>
    </>
  )
}
