"use client"

import { useState, useEffect, useCallback } from "react"
import { Header } from "../components/header"
import { FadeIn, FadeInView, motion, AnimatePresence } from "../components/motion"
import { MUDURLUKLER } from "../lib/test-data"

interface Paylasim {
  id: string
  ad_soyad: string | null
  mudurluk: string | null
  anonim: boolean
  kitap_adi: string
  yazar: string
  alinti: string
  yorum: string | null
  olusturma_tarihi: string
  psikolog_begeni: boolean
  like_sayisi: number
  kaynak: string
}

interface Oneri {
  id: string; tur: string; baslik: string; aciklama?: string
  url?: string; yazar?: string; alinti?: string; olusturma_tarihi: string
}

const TUR_ICON: Record<string, { icon: string; color: string }> = {
  kitap: { icon: "menu_book", color: "text-violet-600" },
  video: { icon: "play_circle", color: "text-rose-600" },
  makale: { icon: "article", color: "text-sky-600" },
  alistirma: { icon: "self_improvement", color: "text-emerald-600" },
  alinti: { icon: "format_quote", color: "text-amber-600" },
}

function getInitials(name: string) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "az önce"
  if (mins < 60) return `${mins} dk`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} sa`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days} gün`
  return new Date(dateStr).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })
}

const AVATAR_COLORS = [
  "from-teal-400 to-emerald-500",
  "from-blue-400 to-indigo-500",
  "from-purple-400 to-violet-500",
  "from-rose-400 to-pink-500",
  "from-amber-400 to-orange-500",
  "from-cyan-400 to-sky-500",
]

function avatarColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

const ONBOARDING_STEPS = [
  {
    icon: "auto_stories",
    title: "Keşfet — Bibliyoterapi Nedir?",
    desc: "Kitap okuma yoluyla kişisel gelişim ve iyileşme. Psikologunuz sizin için seçtiği kitaplar ve alıntılarla bu yolculuğa eşlik ediyor.",
  },
  {
    icon: "verified",
    title: "Psikologdan İçerikler",
    desc: "Kurum psikoloğunuz düzenli olarak kitap alıntıları, videolar ve içerikler paylaşır. Bunları Psikologdan sekmesinde bulabilirsiniz.",
  },
  {
    icon: "groups",
    title: "2.300 Kişilik Kütüphane",
    desc: "Belediyemizin tüm personeli bu sayfayı görüyor. Siz de okuduğunuz bir kitaptan etkilendiğiniz bir bölümü paylaşarak bu ortak kütüphaneye katkıda bulunabilirsiniz. Paylaşımınız psikolog onayından sonra herkes tarafından görülür ve beğenilebilir.",
  },
  {
    icon: "bookmark",
    title: "Size Özel Kitap Listesi",
    desc: "Görüşmeniz sonrası psikologunuz size özel kitap önerileri hazırlar. Referans kodunuzla sorgulayarak kişisel listenize ulaşabilirsiniz.",
  },
]

function Onboarding({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const s = ONBOARDING_STEPS[step]
  const isLast = step === ONBOARDING_STEPS.length - 1

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-gradient-to-b from-[#0f3d3d] to-[#1a5555] flex flex-col items-center justify-center px-8 text-center text-white"
    >
      {/* Skip */}
      <button onClick={onClose} className="absolute top-14 right-6 text-white/40 text-xs font-medium hover:text-white/70 transition-colors">
        Atla
      </button>

      {/* Step indicator */}
      <div className="flex gap-1.5 mb-10">
        {ONBOARDING_STEPS.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-white" : "w-1.5 bg-white/20"}`} />
        ))}
      </div>

      {/* Icon */}
      <motion.div
        key={step}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="w-20 h-20 rounded-3xl bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center mb-8"
      >
        <span className="material-symbols-outlined text-4xl text-white filled">{s.icon}</span>
      </motion.div>

      {/* Content */}
      <motion.div
        key={`text-${step}`}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-2xl font-extrabold font-headline tracking-tight mb-3">{s.title}</h2>
        <p className="text-white/60 text-sm leading-relaxed max-w-xs mx-auto">{s.desc}</p>
      </motion.div>

      {/* Button */}
      <motion.button
        onClick={() => isLast ? onClose() : setStep(step + 1)}
        whileTap={{ scale: 0.95 }}
        className="mt-12 px-10 py-4 rounded-2xl bg-white text-[#1a5555] font-bold text-sm shadow-xl shadow-black/20"
      >
        {isLast ? "Keşfetmeye Başla" : "Devam"}
      </motion.button>
    </motion.div>
  )
}

export default function KesfetPage() {
  const [feed, setFeed] = useState<Paylasim[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set())
  const [tab, setTab] = useState<"herkes" | "psikolog">("psikolog")
  const [showOnboarding, setShowOnboarding] = useState(false)

  // Kişisel öneriler
  const [refKodu, setRefKodu] = useState("")
  const [oneriler, setOneriler] = useState<Oneri[]>([])
  const [refSaved, setRefSaved] = useState(false)
  const [oneriLoading, setOneriLoading] = useState(false)

  // Form state
  const [fKitap, setFKitap] = useState("")
  const [fYazar, setFYazar] = useState("")
  const [fAlinti, setFAlinti] = useState("")
  const [fYorum, setFYorum] = useState("")
  const [fAd, setFAd] = useState("")
  const [fMud, setFMud] = useState("")
  const [fAnonim, setFAnonim] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [showOneriler, setShowOneriler] = useState(false)

  const fetchFeed = useCallback(async () => {
    try {
      const res = await fetch("/api/kesfet")
      if (res.ok) setFeed(await res.json())
    } catch {} finally { setLoading(false) }
  }, [])

  useEffect(() => { fetchFeed() }, [fetchFeed])

  useEffect(() => {
    const saved = localStorage.getItem("kesfet_ref")
    if (saved) { setRefKodu(saved); setRefSaved(true); fetchOneriler(saved) }
    const liked = localStorage.getItem("kesfet_liked")
    if (liked) try { setLikedIds(new Set(JSON.parse(liked))) } catch {}
    // Onboarding — sadece ilk ziyarette
    const isDev = window.location.hostname === "localhost"
    if (isDev || !localStorage.getItem("kesfet_onboarded")) setShowOnboarding(true)
  }, [])

  async function fetchOneriler(kod: string) {
    setOneriLoading(true)
    try {
      const res = await fetch(`/api/oneriler?ref=${kod}`)
      if (res.ok) { setOneriler(await res.json()); localStorage.setItem("kesfet_ref", kod); setRefSaved(true) }
    } catch {} finally { setOneriLoading(false) }
  }

  async function handleLike(id: string) {
    if (likedIds.has(id)) return
    try {
      const res = await fetch("/api/kesfet/like", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paylasimId: id }),
      })
      if (res.ok || res.status === 409) {
        setLikedIds(prev => { const n = new Set(prev); n.add(id); localStorage.setItem("kesfet_liked", JSON.stringify([...n])); return n })
        setFeed(prev => prev.map(p => p.id === id ? { ...p, like_sayisi: p.like_sayisi + 1 } : p))
      }
    } catch {}
  }

  async function handleSubmit() {
    if (!fKitap.trim() || !fYazar.trim() || !fAlinti.trim() || fAlinti.trim().length < 10) return
    setSubmitting(true)
    try {
      const res = await fetch("/api/kesfet", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kitapAdi: fKitap, yazar: fYazar, alinti: fAlinti, yorum: fYorum,
          adSoyad: fAd, mudurluk: fMud, anonim: fAnonim,
        }),
      })
      if (res.ok) { setSubmitted(true); setFKitap(""); setFYazar(""); setFAlinti(""); setFYorum(""); setFAd(""); setFMud("") }
    } catch {} finally { setSubmitting(false) }
  }

  return (
    <>
      <AnimatePresence>
        {showOnboarding && (
          <Onboarding onClose={() => { setShowOnboarding(false); localStorage.setItem("kesfet_onboarded", "1") }} />
        )}
      </AnimatePresence>

      <Header />
      <div className="pt-16 pb-24 min-h-screen bg-[#f6fafa]">

        {/* ═══ HEADER ═══ */}
        <div className="sticky top-16 z-30 bg-[#f6fafa]/80 backdrop-blur-xl border-b border-outline-variant/10">
          <div className="max-w-lg mx-auto flex items-center justify-between px-5 py-3">
            <div>
              <div className="flex items-baseline gap-2">
                <h1 className="font-headline font-extrabold text-on-surface text-lg tracking-tight">Keşfet</h1>
                <span className="text-[10px] font-semibold text-primary/60 uppercase tracking-widest">Bibliyoterapi</span>
              </div>
            </div>
            <motion.button
              onClick={() => { setShowForm(true); setSubmitted(false) }}
              whileTap={{ scale: 0.93 }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-primary text-on-primary text-xs font-bold shadow-lg shadow-primary/20"
            >
              <span className="material-symbols-outlined text-base">edit</span>
              Paylaş
            </motion.button>
          </div>
        </div>

        <div className="max-w-lg mx-auto">

          {/* ═══ SORGULA ═══ */}
          <div className="mx-5 mt-4 mb-2 rounded-xl bg-white border border-outline-variant/10 px-4 py-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-violet-600 text-base filled">bookmark</span>
              <span className="text-xs font-bold text-on-surface">Sorgula</span>
              <span className="text-[10px] text-on-surface-variant">— görüşmenize özel kitap önerileri</span>
            </div>
            {!refSaved ? (
              <div className="flex gap-2">
                <input value={refKodu} onChange={e => setRefKodu(e.target.value.toUpperCase())} placeholder="KPB-XXXX" maxLength={8}
                  className="flex-1 bg-surface-container-high/30 rounded-lg px-3 py-2 text-sm font-mono text-center tracking-widest placeholder:text-outline/30 outline-none border-none" />
                <button onClick={() => refKodu.length >= 7 && fetchOneriler(refKodu)} disabled={refKodu.length < 7 || oneriLoading}
                  className="px-4 py-2 rounded-lg bg-violet-600 text-white text-xs font-bold disabled:opacity-30">
                  {oneriLoading ? "..." : "Sorgula"}
                </button>
              </div>
            ) : oneriler.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-xs">
                    <span className="material-symbols-outlined text-xs text-green-600 filled">verified</span>
                    <span className="font-mono font-bold text-on-surface">{refKodu}</span>
                  </span>
                  <button onClick={() => { setRefSaved(false); setOneriler([]); localStorage.removeItem("kesfet_ref") }}
                    className="text-[10px] text-on-surface-variant hover:text-primary underline">Değiştir</button>
                </div>
                <div className="space-y-1.5">
                  {oneriler.map(o => {
                    const t = TUR_ICON[o.tur] ?? TUR_ICON.kitap
                    return (
                      <div key={o.id} className="flex gap-2 p-2 rounded-lg bg-violet-50/50">
                        <span className={`material-symbols-outlined text-sm ${t.color} filled mt-0.5`}>{t.icon}</span>
                        <div className="flex-1 min-w-0">
                          <span className="text-xs font-semibold text-on-surface">{o.baslik}</span>
                          {o.yazar && <span className="text-[10px] text-on-surface-variant ml-1">— {o.yazar}</span>}
                          {o.url && <a href={o.url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-primary font-semibold ml-1 hover:underline">Aç →</a>}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : (
              <p className="text-[10px] text-on-surface-variant">Henüz öneri yok. Görüşme sonrası burada görünecek.</p>
            )}
          </div>

          {/* ═══ AÇIKLAMA ═══ */}
          <div className="mx-5 mb-2 px-4 py-2.5 rounded-xl bg-white/60 border border-outline-variant/8 space-y-1">
            <div className="flex items-center gap-2 text-[11px]">
              <span className="material-symbols-outlined text-amber-500 text-xs filled">verified</span>
              <span><strong className="text-on-surface">Psikologdan</strong> <span className="text-on-surface-variant">— düzenli alıntılar, içerikler ve videolar</span></span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="material-symbols-outlined text-primary text-xs filled">groups</span>
              <span><strong className="text-on-surface">Herkes</strong> <span className="text-on-surface-variant">— tüm belediye personeli görebilir ve katkıda bulunabilir</span></span>
            </div>
          </div>

          {/* ═══ TAB SEÇİCİ ═══ */}
          <div className="flex gap-1 px-5 pt-3 pb-2">
            <button onClick={() => setTab("psikolog")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === "psikolog" ? "bg-amber-500 text-white shadow-sm" : "bg-white text-on-surface-variant"}`}>
              <span className="material-symbols-outlined text-sm align-middle mr-1">verified</span>
              Psikologdan
            </button>
            <button onClick={() => setTab("herkes")}
              className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === "herkes" ? "bg-primary text-on-primary shadow-sm" : "bg-white text-on-surface-variant"}`}>
              <span className="material-symbols-outlined text-sm align-middle mr-1">groups</span>
              Herkes
            </button>
          </div>

          {/* ═══ TİMELINE ═══ */}
          <div className="px-5 pt-2 space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white p-5 animate-pulse">
                  <div className="flex gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-muted" /><div className="flex-1 space-y-2"><div className="h-3 bg-muted rounded w-1/3" /><div className="h-2 bg-muted rounded w-1/4" /></div></div>
                  <div className="h-16 bg-muted rounded-xl" />
                </div>
              ))
            ) : feed.filter(p => tab === "psikolog" ? p.kaynak === "psikolog" : p.kaynak !== "psikolog").length === 0 ? (
              <div className="text-center py-16">
                <span className="material-symbols-outlined text-5xl text-on-surface-variant/20 mb-3">auto_stories</span>
                <p className="font-headline font-bold text-on-surface mb-1">Henüz paylaşım yok</p>
                <p className="text-sm text-on-surface-variant">
                  {tab === "psikolog" ? "Psikologdan içerikler yakında burada olacak." : "Yukarıdaki Paylaş butonuyla ilk alıntıyı siz ekleyin!"}
                </p>
              </div>
            ) : (
              feed.filter(p => tab === "psikolog" ? p.kaynak === "psikolog" : p.kaynak !== "psikolog").map((p, i) => {
                const isPsikolog = p.kaynak === "psikolog"
                const displayName = isPsikolog ? "Uzm. Kl. Psk. Yusuf Pamuk" : p.anonim ? "Anonim" : (p.ad_soyad || "Bir Personel")
                const liked = likedIds.has(p.id)
                return (
                  <FadeInView key={p.id} delay={i * 0.04}>
                    <article className={`rounded-2xl overflow-hidden shadow-sm ${isPsikolog ? "bg-gradient-to-br from-amber-50 via-white to-amber-50/30 border border-amber-200/30" : "bg-white border border-outline-variant/8"}`}>
                      {/* Header */}
                      <div className="flex items-center gap-3 px-5 pt-4 pb-2">
                        {isPsikolog ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-amber-200">
                            YP
                          </div>
                        ) : (
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.anonim ? "from-gray-300 to-gray-400" : avatarColor(displayName)} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                            {p.anonim ? <span className="material-symbols-outlined text-base">person_off</span> : getInitials(displayName)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-on-surface truncate">{displayName}</span>
                            {isPsikolog && (
                              <span className="material-symbols-outlined text-amber-500 text-sm filled">verified</span>
                            )}
                            {!isPsikolog && p.psikolog_begeni && (
                              <span className="material-symbols-outlined text-amber-500 text-sm filled" title="Psikolog tarafından beğenildi">verified</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-on-surface-variant">
                            {isPsikolog && <span className="text-amber-600 font-semibold">Kurum Psikoloğu</span>}
                            {isPsikolog && <span>·</span>}
                            {!isPsikolog && !p.anonim && p.mudurluk && <span className="truncate max-w-[140px]">{p.mudurluk}</span>}
                            {!isPsikolog && !p.anonim && p.mudurluk && <span>·</span>}
                            <span>{timeAgo(p.olusturma_tarihi)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Kitap badge */}
                      <div className="px-5 pb-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-medium">
                          <span className="material-symbols-outlined text-xs">menu_book</span>
                          {p.kitap_adi} — {p.yazar}
                        </span>
                      </div>

                      {/* Alıntı */}
                      <div className="px-5 pb-3">
                        <blockquote className="text-on-surface text-[15px] leading-[1.8] font-medium italic pl-4 border-l-3 border-primary/30">
                          &ldquo;{p.alinti}&rdquo;
                        </blockquote>
                      </div>

                      {/* Yorum */}
                      {p.yorum && (
                        <div className="px-5 pb-3">
                          <p className="text-sm text-on-surface-variant leading-relaxed">{p.yorum}</p>
                        </div>
                      )}

                      {/* Psikolog rozeti */}
                      {p.psikolog_begeni && (
                        <div className="mx-5 mb-3 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50/80 border border-amber-200/30">
                          <span className="material-symbols-outlined text-amber-600 text-sm filled">workspace_premium</span>
                          <span className="text-[10px] font-semibold text-amber-700">Psikolog Seçkisi</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center border-t border-outline-variant/8 px-5 py-2.5">
                        <motion.button
                          onClick={() => handleLike(p.id)}
                          whileTap={{ scale: 1.3 }}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-rose-500" : "text-on-surface-variant hover:text-rose-400"}`}
                        >
                          <span className={`material-symbols-outlined text-xl ${liked ? "filled" : ""}`}>favorite</span>
                          <span className="text-xs font-medium">{p.like_sayisi || ""}</span>
                        </motion.button>
                      </div>
                    </article>
                  </FadeInView>
                )
              })
            )}
          </div>
        </div>

        {/* ═══ PAYLAŞIM FORMU (bottom sheet) ═══ */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              onClick={() => setShowForm(false)}
            >
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                onClick={e => e.stopPropagation()}
                className="absolute bottom-0 left-0 right-0 max-h-[92vh] bg-white rounded-t-3xl overflow-y-auto"
              >
                {/* Handle bar */}
                <div className="flex justify-center py-3">
                  <div className="w-10 h-1 rounded-full bg-outline-variant/30" />
                </div>

                {submitted ? (
                  <div className="text-center px-6 pb-12 pt-4">
                    <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                      <span className="material-symbols-outlined text-green-600 text-3xl filled">check_circle</span>
                    </div>
                    <h3 className="font-headline font-bold text-on-surface text-xl mb-2">Paylaşımınız Alındı!</h3>
                    <p className="text-sm text-on-surface-variant mb-6 max-w-xs mx-auto">
                      Psikologumuz inceledikten sonra Keşfet akışında görünecek. Katılımınız için teşekkürler!
                    </p>
                    <button onClick={() => setShowForm(false)}
                      className="px-8 py-3 rounded-full bg-primary text-on-primary font-bold text-sm">Kapat</button>
                  </div>
                ) : (
                  <div className="px-6 pb-28 space-y-5">
                    <div>
                      <h3 className="font-headline font-bold text-on-surface text-lg">Alıntı Paylaş</h3>
                      <p className="text-xs text-on-surface-variant mt-0.5">Okuduğunuz kitaptan sizi etkileyen bir bölümü paylaşın</p>
                    </div>

                    {/* Kitap + Yazar */}
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 block">Kitap Adı *</label>
                        <input value={fKitap} onChange={e => setFKitap(e.target.value)} placeholder="ör: Duygusal Zeka"
                          className="w-full bg-surface-container-high/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline/30 outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 block">Yazar *</label>
                        <input value={fYazar} onChange={e => setFYazar(e.target.value)} placeholder="ör: Daniel Goleman"
                          className="w-full bg-surface-container-high/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline/30 outline-none" />
                      </div>
                    </div>

                    {/* Alıntı */}
                    <div>
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 block">Alıntı *</label>
                      <textarea value={fAlinti} onChange={e => setFAlinti(e.target.value)} rows={4} maxLength={1000}
                        placeholder="Kitaptan sizi etkileyen bölümü buraya yazın..."
                        className="w-full bg-surface-container-high/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline/30 outline-none resize-none" />
                      <div className="text-right text-[10px] text-outline mt-0.5">{fAlinti.length}/1000</div>
                    </div>

                    {/* Yorum */}
                    <div>
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1.5 block">Yorumunuz <span className="font-normal normal-case text-outline">(isteğe bağlı)</span></label>
                      <textarea value={fYorum} onChange={e => setFYorum(e.target.value)} rows={2} maxLength={500}
                        placeholder="Bu alıntı sizde ne hissettirdi?"
                        className="w-full bg-surface-container-high/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline/30 outline-none resize-none" />
                    </div>

                    {/* Kimlik */}
                    <div>
                      <label className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block">Kimlik</label>
                      <div className="flex gap-2 mb-3">
                        <button onClick={() => setFAnonim(false)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${!fAnonim ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"}`}>
                          İsimli
                        </button>
                        <button onClick={() => setFAnonim(true)}
                          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${fAnonim ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"}`}>
                          Anonim
                        </button>
                      </div>
                      {!fAnonim && (
                        <div className="space-y-3">
                          <input value={fAd} onChange={e => setFAd(e.target.value)} placeholder="Ad Soyad"
                            className="w-full bg-surface-container-high/30 rounded-xl px-4 py-3 text-sm text-on-surface placeholder:text-outline/30 outline-none" />
                          <select value={fMud} onChange={e => setFMud(e.target.value)}
                            className="w-full bg-surface-container-high/30 rounded-xl px-4 py-3 text-sm text-on-surface outline-none appearance-none">
                            <option value="">Müdürlük</option>
                            {MUDURLUKLER.map(m => <option key={m} value={m}>{m}</option>)}
                          </select>
                        </div>
                      )}
                    </div>

                    {/* Submit */}
                    <motion.button
                      onClick={handleSubmit}
                      disabled={!fKitap.trim() || !fYazar.trim() || fAlinti.trim().length < 10 || submitting}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-sm shadow-xl shadow-primary/20 disabled:opacity-30 transition-all"
                    >
                      {submitting ? "Gönderiliyor..." : "Paylaş"}
                    </motion.button>

                    <p className="text-[10px] text-on-surface-variant/50 text-center">
                      Paylaşımınız psikolog onayından sonra yayınlanacaktır.
                    </p>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}
