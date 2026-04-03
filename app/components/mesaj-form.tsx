"use client"

import { useState } from "react"
import { FadeIn, FadeInView, SuccessCheck, PulseGlow, motion, AnimatePresence } from "./motion"
import { MUDURLUKLER } from "../lib/test-data"
import { MudurlukSelect } from "./mudurluk-select"

const KATEGORILER = [
  { label: "Görüşme Hakkında Soru", icon: "help_outline" },
  { label: "Öneri / Geri Bildirim", icon: "lightbulb" },
  { label: "Şikayet", icon: "report" },
  { label: "Genel Soru", icon: "chat" },
  { label: "Acil Destek Talebi", icon: "emergency" },
] as const

export function MesajForm() {
  const [anonim, setAnonim] = useState(true)
  const [adSoyad, setAdSoyad] = useState("")
  const [mudurluk, setMudurluk] = useState("")
  const [email, setEmail] = useState("")
  const [kategori, setKategori] = useState("")
  const [mesaj, setMesaj] = useState("")
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!kategori) { setError("Lütfen bir kategori seçiniz."); return }
    if (mesaj.trim().length < 5) { setError("Mesajınız en az 5 karakter olmalıdır."); return }
    if (!anonim && !adSoyad.trim()) { setError("Lütfen adınızı ve soyadınızı giriniz."); return }
    if (!anonim && !mudurluk) { setError("Lütfen müdürlüğünüzü seçiniz."); return }

    setError("")
    setSending(true)

    try {
      const res = await fetch("/api/mesaj", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonim,
          adSoyad: anonim ? null : adSoyad.trim(),
          mudurluk: anonim ? null : mudurluk,
          email: email.trim() || null,
          kategori,
          mesaj: mesaj.trim(),
        }),
      })

      if (!res.ok) throw new Error()
      setDone(true)
    } catch {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.")
    } finally {
      setSending(false)
    }
  }

  const resetForm = () => {
    setDone(false)
    setAnonim(true)
    setAdSoyad("")
    setMudurluk("")
    setEmail("")
    setKategori("")
    setMesaj("")
  }

  if (done) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
        <SuccessCheck />
        <FadeIn delay={0.4}>
          <h2 className="text-2xl font-headline font-bold text-on-surface mt-8 mb-3">
            Mesajınız İletildi
          </h2>
        </FadeIn>
        <FadeIn delay={0.6}>
          <p className="text-on-surface-variant text-sm mb-8 max-w-sm">
            Mesajınız kurumsal psikolog tarafından değerlendirilecektir.
            {email && " Yanıt e-posta adresinize gönderilecektir."}
          </p>
        </FadeIn>
        <FadeIn delay={0.8}>
          <motion.button
            onClick={resetForm}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-4 rounded-2xl bg-primary text-on-primary font-bold shadow-lg shadow-black/5 transition-all"
          >
            Yeni Mesaj Gönder
          </motion.button>
        </FadeIn>
      </div>
    )
  }

  return (
    <details className="group rounded-3xl border border-outline-variant/10 bg-surface-lowest shadow-[0_10px_40px_rgba(0,0,0,0.04)] overflow-hidden">
      <summary className="flex items-center gap-4 p-5 cursor-pointer list-none select-none">
        <div className="w-11 h-11 rounded-2xl bg-primary-container flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-primary text-xl filled">chat_bubble</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold font-headline text-on-surface">Anonim Mesaj</h3>
          <p className="text-xs text-on-surface-variant">Psikoloğa özel mesaj gönderin</p>
        </div>
        <span className="material-symbols-outlined text-on-surface-variant transition-transform duration-300 group-open:rotate-180">expand_more</span>
      </summary>

      <div className="px-5 pb-6 space-y-6">

      {/* Anonim / İsimli Toggle */}
      <FadeInView>
        <div className="bg-surface-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <label className="block text-xs font-bold font-mono text-primary mb-3 ml-1 tracking-wider uppercase">
            Kimlik Tercihi
          </label>
          <div className="grid grid-cols-2 gap-2">
            <motion.button type="button" onClick={() => setAnonim(true)} whileTap={{ scale: 0.95 }}
              className={`py-3.5 rounded-2xl text-sm font-bold transition-all ${anonim ? "bg-primary text-on-primary shadow-md shadow-black/5" : "bg-surface-container-low text-on-surface-variant hover:bg-white"}`}>
              <span className="material-symbols-outlined text-base align-middle mr-1">visibility_off</span> Anonim
            </motion.button>
            <motion.button type="button" onClick={() => setAnonim(false)} whileTap={{ scale: 0.95 }}
              className={`py-3.5 rounded-2xl text-sm font-bold transition-all ${!anonim ? "bg-primary text-on-primary shadow-md shadow-black/5" : "bg-surface-container-low text-on-surface-variant hover:bg-white"}`}>
              <span className="material-symbols-outlined text-base align-middle mr-1">person</span> İsimli
            </motion.button>
          </div>
        </div>
      </FadeInView>

      {/* İsimli Alanlar */}
      <AnimatePresence>
        {!anonim && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="bg-surface-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)] space-y-5">
              <div>
                <label className="block text-xs font-bold font-mono text-primary mb-2 ml-1 tracking-wider uppercase">Ad Soyad</label>
                <input type="text" value={adSoyad} onChange={(e) => setAdSoyad(e.target.value)} placeholder="Adınız ve soyadınız"
                  className="w-full bg-surface-container-high/40 border-none rounded-2xl px-5 py-4 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold font-mono text-primary mb-2 ml-1 tracking-wider uppercase">Müdürlük</label>
                <MudurlukSelect value={mudurluk} onChange={setMudurluk} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* E-posta */}
      <FadeInView delay={0.05}>
        <div className="bg-surface-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <label className="block text-xs font-bold font-mono text-primary mb-2 ml-1 tracking-wider uppercase">
            E-posta <span className="font-normal text-outline normal-case">(isteğe bağlı)</span>
          </label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ornek@mail.com"
            className="w-full bg-surface-container-high/40 border-none rounded-2xl px-5 py-4 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none" />
          <p className="text-[11px] text-outline mt-2 ml-1">Cevap alabilmek için e-posta adresinizi girebilirsiniz.</p>
        </div>
      </FadeInView>

      {/* Kategori */}
      <FadeInView delay={0.1}>
        <div className="bg-surface-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <label className="block text-xs font-bold font-mono text-primary mb-3 ml-1 tracking-wider uppercase">Konu</label>
          <div className="space-y-2">
            {KATEGORILER.map((k) => (
              <motion.button key={k.label} type="button" onClick={() => setKategori(k.label)}
                whileTap={{ scale: 0.97 }} whileHover={{ x: 4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all flex items-center gap-3 ${
                  kategori === k.label ? "bg-primary-container text-on-primary-container font-semibold" : "bg-surface-container-low text-on-surface-variant hover:bg-white"
                }`}>
                <span className={`material-symbols-outlined text-lg ${kategori === k.label ? "text-primary" : "text-on-surface-variant/50"}`}>{k.icon}</span>
                {k.label}
              </motion.button>
            ))}
          </div>
        </div>
      </FadeInView>

      {/* Mesaj */}
      <FadeInView delay={0.15}>
        <div className="bg-surface-lowest rounded-3xl p-6 border border-outline-variant/10 shadow-[0_10px_40px_rgba(0,0,0,0.04)]">
          <label className="block text-xs font-bold font-mono text-primary mb-2 ml-1 tracking-wider uppercase">Mesajınız</label>
          <textarea value={mesaj} onChange={(e) => setMesaj(e.target.value)}
            placeholder="Görüşme öncesi/sonrası düşünceleriniz, sorularınız veya paylaşmak istedikleriniz..."
            rows={6} maxLength={5000}
            className="w-full bg-surface-container-high/40 border-none rounded-2xl px-5 py-4 text-on-surface placeholder:text-outline/40 focus:ring-2 focus:ring-primary/20 transition-all outline-none resize-none" />
          <div className="flex justify-between mt-1 px-1">
            <span className="text-[10px] text-outline">En az 5 karakter</span>
            <span className={`text-[10px] transition-colors ${mesaj.length > 4500 ? "text-error font-bold" : "text-outline"}`}>{mesaj.length}/5000</span>
          </div>
        </div>
      </FadeInView>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-base">error</span>{error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Gönder */}
      <PulseGlow>
        <motion.button onClick={handleSubmit} disabled={sending} whileTap={{ scale: 0.97 }}
          className="w-full bg-primary hover:opacity-90 transition-all duration-300 py-5 rounded-3xl flex items-center justify-center gap-3 shadow-xl shadow-black/5 disabled:opacity-50">
          {sending ? (
            <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="material-symbols-outlined text-on-primary">progress_activity</motion.span>
          ) : (
            <>
              <span className="text-on-primary font-bold text-lg">Mesajı Gönder</span>
              <span className="material-symbols-outlined text-on-primary">send</span>
            </>
          )}
        </motion.button>
      </PulseGlow>
      </div>
    </details>
  )
}
