"use client"

import { useState, useMemo, useEffect } from "react"
import { nanoid } from "nanoid"
import { addDays, format, getDay, startOfDay } from "date-fns"
import { tr } from "date-fns/locale"
import { Header } from "../components/header"
import { FadeIn, FadeInView, StaggerContainer, StaggerItem, SuccessCheck, PulseGlow, motion, AnimatePresence } from "../components/motion"
import { MUDURLUKLER } from "../lib/test-data"
import { MudurlukSelect } from "../components/mudurluk-select"

type Tur = "ilk" | "takip" | "acil"
const TURLER: { value: Tur; icon: string; label: string; apiLabel: string }[] = [
  { value: "ilk", icon: "person_add", label: "İlk Görüşme", apiLabel: "İlk Görüşme" },
  { value: "takip", icon: "event_repeat", label: "Takip", apiLabel: "Takip" },
  { value: "acil", icon: "emergency", label: "Acil", apiLabel: "Acil" },
]

type TestDurum = "" | "online" | "kagit"

interface Musaitlik { gun: number; baslangic: string; bitis: string; slotDk: number; aktif: boolean }

function makeSlots(b: string, e: string, dk: number): string[] {
  const s: string[] = []
  let m = b.split(":").reduce((a,b)=>a*60+Number(b),0)
  const end = e.split(":").reduce((a,b)=>a*60+Number(b),0)
  while (m + dk <= end) {
    s.push(`${String(Math.floor(m/60)).padStart(2,"0")}:${String(m%60).padStart(2,"0")}`)
    m += dk
  }
  return s
}

export default function RandevuPage() {
  const [ad, setAd] = useState("")
  const [unvan, setUnvan] = useState<"" | "Başkan" | "Başkan Yardımcısı" | "Müdür">("")
  const [mud, setMud] = useState("")
  const [kseDurum, setKseDurum] = useState<TestDurum>("")
  const [bfiDurum, setBfiDurum] = useState<TestDurum>("")
  const [tur, setTur] = useState<Tur | "">("")
  const [not, setNot] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState(false)
  const [refCode, setRefCode] = useState("")
  const [err, setErr] = useState("")
  const [musaitlik, setMusaitlik] = useState<Musaitlik[]>([])
  const [dolu, setDolu] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/musaitlik").then(r => r.json()).then(d => {
      setMusaitlik(d.musaitlik || [])
      setDolu(new Set(d.doluSlotlar || []))
    }).catch(() => setErr("Takvim yüklenemedi. Lütfen sayfayı yenileyin veya Dahili 4405'i arayın.")).finally(() => setLoading(false))
  }, [])

  const days = useMemo(() => {
    const r: Date[] = []
    const today = startOfDay(new Date())
    for (let i = 1; i <= 21 && r.length < 10; i++) {
      const d = addDays(today, i)
      const dow = getDay(d)
      if (dow >= 1 && dow <= 5 && musaitlik.find(m => m.gun === dow)?.aktif) r.push(d)
    }
    return r
  }, [musaitlik])

  const slots = useMemo(() => {
    if (!date) return []
    const c = musaitlik.find(m => m.gun === getDay(new Date(date)))
    return c?.aktif ? makeSlots(c.baslangic, c.bitis, c.slotDk) : []
  }, [date, musaitlik])

  const turItem = TURLER.find(t => t.value === tur)
  const turLabel = turItem?.label ?? ""
  const turApi = turItem?.apiLabel ?? ""

  const effectiveMud = unvan === "Başkan" || unvan === "Başkan Yardımcısı" ? unvan : mud
  const s1 = !!ad.trim() && !!effectiveMud
  const s1b = !!kseDurum && !!bfiDurum // testler tamamlandı
  const s2 = !!tur
  const s3 = !!date
  const s4 = !!time
  const allDone = s1 && s1b && s2 && s3 && s4

  const submit = async () => {
    if (!allDone) { setErr("Lütfen tüm alanları doldurun."); return }
    setSending(true); setErr("")
    try {
      const r = await fetch("/api/randevu", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: nanoid(),
          adSoyad: ad.trim(),
          mudurluk: effectiveMud,
          gorusmeTuru: turApi,
          not: not.trim(),
          istenenTarih: date,
          istenenSaat: time,
          kseDurumu: kseDurum,
          bfiDurumu: bfiDurum,
        }),
      })
      if (!r.ok) throw new Error()
      const data = await r.json()
      setRefCode(data.referansKodu || "")
      setDone(true)
    } catch { setErr("Bir hata oluştu. Tekrar deneyin.") }
    finally { setSending(false) }
  }

  if (done) {
    return (
      <>
        <Header title="Kurumsal Psikoloji Birimi" />
        <div className="pt-24 px-6 flex-1 flex items-center justify-center">
          <div className="max-w-sm w-full text-center space-y-6">
            <SuccessCheck />
            <FadeIn delay={0.4}>
              <h2 className="text-2xl font-headline font-extrabold text-on-surface tracking-tight">Talebiniz Alındı!</h2>
            </FadeIn>
            <FadeIn delay={0.6}>
              <p className="text-on-surface-variant leading-relaxed">
                <strong>{format(new Date(date), "d MMMM yyyy, EEEE", { locale: tr })}</strong> günü
                saat <strong>{time}</strong> için talebiniz oluşturuldu.
              </p>
            </FadeIn>
            <FadeIn delay={0.8}>
              <div className="glass-card rounded-3xl p-5 space-y-3">
                <p className="text-sm text-on-surface-variant">Randevunuz onaylandığında bilgilendirileceksiniz.</p>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] uppercase font-bold text-outline-variant tracking-wider">Referans</span>
                  <span className="font-mono text-lg font-extrabold text-primary tracking-widest">
                    {refCode}
                  </span>
                </div>
                <p className="text-[10px] text-on-surface-variant/60">Bu kodu saklayınız.</p>
              </div>
            </FadeIn>
            <FadeIn delay={1.0}>
              <button onClick={() => { setDone(false); setRefCode(""); setAd(""); setMud(""); setKseDurum(""); setBfiDurum(""); setTur(""); setNot(""); setDate(""); setTime("") }}
                className="text-sm text-primary font-semibold hover:underline">Yeni talep oluştur</button>
            </FadeIn>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header title="Kurumsal Psikoloji Birimi" />
      <div className="pt-24 pb-8 px-6 max-w-2xl mx-auto space-y-10">
        {/* Hero */}
        <FadeIn>
        <section className="text-center space-y-3">
          <h2 className="font-headline font-extrabold text-3xl text-on-surface tracking-tight">Randevunuzu Planlayın</h2>
          <p className="text-on-surface-variant text-sm leading-relaxed max-w-sm mx-auto">
            Görüşmeleriniz etik kurallar çerçevesinde sadece psikoloğunuz ile aranızda kalır.
          </p>
        </section>
        </FadeIn>

        {/* Quick call card */}
        <FadeIn delay={0.1}>
        <motion.div
          whileHover={{ y: -2, boxShadow: "0 12px 40px rgba(41,104,104,0.06)" }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="glass-card p-5 rounded-3xl flex items-center gap-4 cursor-default"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-primary">call</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-outline-variant uppercase tracking-wider mb-0.5">Hızlı Randevu</p>
            <p className="text-sm font-medium text-on-surface">Telefonla da arayabilirsiniz: <span className="font-extrabold text-primary whitespace-nowrap">Dahili: 4405</span></p>
          </div>
        </motion.div>
        </FadeIn>

        {/* Step 1 — Kişisel Bilgiler */}
        <FadeIn delay={0.25}>
        <section className="space-y-4">
          <StepHead n={1} title="Kişisel Bilgiler" done={s1} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-outline px-2">Ad Soyad</label>
              <input value={ad} onChange={e => setAd(e.target.value)} placeholder="Örn: Ahmet Yılmaz" type="text" aria-label="Ad Soyad"
                className="w-full h-14 px-5 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none" />
              <div className="flex items-center gap-1.5 px-1 pt-1">
                <span className="text-[10px] text-outline">Unvan:</span>
                {(["Başkan", "Başkan Yardımcısı", "Müdür"] as const).map(u => (
                  <button key={u} type="button" onClick={() => { setUnvan(unvan === u ? "" : u); if (u !== "Müdür") setMud("") }}
                    className={`px-2 py-0.5 rounded-md text-[10px] font-semibold transition-all ${
                      unvan === u
                        ? "bg-primary text-on-primary"
                        : "bg-surface-container-low text-on-surface-variant"
                    }`}>
                    {u}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-outline px-2">Bağlı Olduğu Müdürlük</label>
              <MudurlukSelect
                value={unvan === "Başkan" || unvan === "Başkan Yardımcısı" ? unvan : mud}
                onChange={setMud}
                disabled={unvan === "Başkan" || unvan === "Başkan Yardımcısı"}
              />
            </div>
          </div>
        </section>
        </FadeIn>

        {/* Step 1b — Test Durumu (zorunlu) */}
        <motion.section animate={{ opacity: s1 ? 1 : 0.3 }} transition={{ duration: 0.3 }}
          className={`space-y-4 ${!s1 ? "pointer-events-none" : ""}`}>
          <StepHead n={2} title="Psikolojik Testler" done={s1b} />
          <p className="text-xs text-on-surface-variant px-1 -mt-2">
            Randevu alabilmek için KSE-53 ve BFI-2 testlerini tamamlamış olmanız gerekmektedir.
          </p>

          {/* Testleri henüz doldurmadıysan */}
          {(!kseDurum || !bfiDurum) && (
            <a href="/testler"
              className="flex items-center gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200 hover:bg-amber-100 transition-colors">
              <span className="material-symbols-outlined text-amber-600">arrow_forward</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-amber-900">Testleri henüz doldurmadım</p>
                <p className="text-xs text-amber-700">Testleri online doldurmak için tıklayın</p>
              </div>
              <span className="material-symbols-outlined text-amber-400">open_in_new</span>
            </a>
          )}

          {/* KSE-53 */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-on-surface px-1">KSE-53 (Kısa Semptom Envanteri)</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setKseDurum("online")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 ${
                  kseDurum === "online"
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}>
                <span className="material-symbols-outlined">devices</span>
                <span className="text-xs font-bold">Online Doldurdum</span>
              </button>
              <button type="button" onClick={() => setKseDurum("kagit")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 ${
                  kseDurum === "kagit"
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}>
                <span className="material-symbols-outlined">description</span>
                <span className="text-xs font-bold">Kağıt Teslim Ettim</span>
              </button>
            </div>
          </div>

          {/* BFI-2 */}
          <div className="space-y-2">
            <p className="text-sm font-semibold text-on-surface px-1">BFI-2 (Kişilik Envanteri)</p>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setBfiDurum("online")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 ${
                  bfiDurum === "online"
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}>
                <span className="material-symbols-outlined">devices</span>
                <span className="text-xs font-bold">Online Doldurdum</span>
              </button>
              <button type="button" onClick={() => setBfiDurum("kagit")}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl transition-all active:scale-95 ${
                  bfiDurum === "kagit"
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}>
                <span className="material-symbols-outlined">description</span>
                <span className="text-xs font-bold">Kağıt Teslim Ettim</span>
              </button>
            </div>
          </div>
        </motion.section>

        {/* Step 2 — Başvuru Türü */}
        <motion.section animate={{ opacity: s1 && s1b ? 1 : 0.3 }} transition={{ duration: 0.3 }}
          className={`space-y-4 ${!(s1 && s1b) ? "pointer-events-none" : ""}`}>
          <StepHead n={3} title="Başvuru Türü" done={s2} />
          <div className="grid grid-cols-3 gap-3">
            {TURLER.map(t => (
              <motion.button key={t.value} type="button" onClick={() => setTur(t.value)}
                whileTap={{ scale: 0.93 }}
                animate={tur === t.value ? { scale: 1.03, y: -2 } : { scale: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl ${
                  tur === t.value
                    ? "bg-primary text-on-primary shadow-lg shadow-primary/10"
                    : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"
                }`}>
                <span className="material-symbols-outlined mb-2">{t.icon}</span>
                <span className="text-xs font-bold">{t.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Step 3 — Tarih */}
        <motion.section animate={{ opacity: s1 && s1b && s2 ? 1 : 0.3 }} transition={{ duration: 0.3 }}
          className={`space-y-4 ${!(s1 && s1b && s2) ? "pointer-events-none" : ""}`}>
          <StepHead n={4} title="Tarih Seçimi" done={s3} />
          <div className="flex overflow-x-auto gap-3 pb-2 -mx-2 px-2 no-scrollbar">
            {loading && Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-16 h-20 rounded-2xl bg-surface-container animate-pulse" />
            ))}
            {days.map(d => {
              const k = format(d, "yyyy-MM-dd")
              const a = date === k
              return (
                <motion.button key={k} type="button" onClick={() => { setDate(k); setTime("") }}
                  whileTap={{ scale: 0.92 }}
                  animate={a ? { scale: 1.05 } : { scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  className={`flex-shrink-0 w-16 h-20 rounded-2xl flex flex-col items-center justify-center gap-1 ${
                    a ? "bg-primary text-on-primary shadow-md" : "bg-surface-lowest border border-outline-variant/10 text-on-surface hover:bg-surface-container"
                  }`}>
                  <span className={`text-[10px] uppercase font-bold tracking-widest ${a ? "opacity-80" : "text-outline"}`}>
                    {format(d, "EEE", { locale: tr })}
                  </span>
                  <span className="text-xl font-extrabold tracking-tighter">{format(d, "d")}</span>
                </motion.button>
              )
            })}
          </div>
        </motion.section>

        {/* Step 4 — Saat */}
        <AnimatePresence>
        {date && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: s1 && s1b && s2 && s3 ? 1 : 0.3, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={`space-y-4 overflow-hidden ${!(s1 && s1b && s2 && s3) ? "pointer-events-none" : ""}`}>
            <StepHead n={5} title="Saat Seçimi" done={s4} />
            <motion.div
              className="grid grid-cols-4 gap-2"
              variants={{ show: { transition: { staggerChildren: 0.03 } }, hidden: {} }}
              initial="hidden" animate="show" key={date}
            >
              {slots.map(s => {
                const busy = dolu.has(`${date}_${s}`)
                const a = time === s
                return (
                  <motion.button key={s} type="button" disabled={busy} onClick={() => setTime(s)}
                    variants={{ hidden: { opacity: 0, scale: 0.8 }, show: { opacity: 1, scale: 1 } }}
                    whileTap={!busy ? { scale: 0.9 } : undefined}
                    className={`py-3 px-1 rounded-xl text-sm font-medium transition-colors ${
                      busy ? "bg-surface-container-high text-outline-variant cursor-not-allowed line-through"
                        : a ? "bg-primary text-on-primary font-bold shadow-lg shadow-primary/20"
                        : "bg-surface-lowest border border-outline-variant/10 text-on-surface hover:bg-primary-container"
                    }`}>{s}</motion.button>
                )
              })}
            </motion.div>
            {slots.length === 0 && <p className="text-sm text-on-surface-variant text-center py-6">Bu gün için müsait saat yok.</p>}
          </motion.section>
        )}
        </AnimatePresence>

        {/* Not alanı (isteğe bağlı) */}
        <AnimatePresence>
        {s1 && s1b && s2 && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="material-symbols-outlined text-outline text-lg">edit_note</span>
              <p className="text-xs font-semibold text-outline">Not (isteğe bağlı)</p>
            </div>
            <textarea value={not} onChange={e => setNot(e.target.value)}
              placeholder="Varsa belirtmek istediğiniz bir durumu yazabilirsiniz..."
              rows={3}
              className="w-full px-5 py-4 bg-surface-container-highest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-outline-variant outline-none resize-none text-sm" />
          </motion.section>
        )}
        </AnimatePresence>

        {/* Summary */}
        <AnimatePresence>
        {allDone && (
          <motion.section
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="p-6 rounded-3xl bg-primary-container/30 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-headline font-bold text-primary">Randevu Özeti</h4>
              <span className="material-symbols-outlined text-primary text-xl">assignment_turned_in</span>
            </div>
            <div className="grid grid-cols-2 gap-y-4 gap-x-2">
              <div>
                <p className="text-[10px] uppercase font-bold text-outline-variant tracking-wider">TARİH & SAAT</p>
                <p className="text-sm font-bold text-on-surface">{format(new Date(date), "d MMMM EEEE", { locale: tr })}, {time}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-outline-variant tracking-wider">GÖRÜŞME</p>
                <p className="text-sm font-bold text-on-surface">{turLabel} Seans</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-outline-variant tracking-wider">PERSONEL</p>
                <p className="text-sm font-bold text-on-surface">{ad} - {mud}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-outline-variant tracking-wider">TESTLER</p>
                <p className="text-sm font-bold text-on-surface">
                  KSE: {kseDurum === "online" ? "Online" : "Kağıt"} · BFI: {bfiDurum === "online" ? "Online" : "Kağıt"}
                </p>
              </div>
            </div>
            {not.trim() && (
              <div>
                <p className="text-[10px] uppercase font-bold text-outline-variant tracking-wider">NOT</p>
                <p className="text-sm text-on-surface">{not.trim()}</p>
              </div>
            )}
          </motion.section>
        )}
        </AnimatePresence>

        {err && <div className="rounded-2xl bg-red-50 text-red-700 px-4 py-3 text-sm">{err}</div>}

        {/* CTA */}
        <div className="pb-6">
          <PulseGlow>
            <motion.button type="button" onClick={submit} disabled={sending || !allDone}
              whileTap={{ scale: 0.97 }}
              animate={{ opacity: allDone ? 1 : 0.4 }}
              className="w-full h-16 bg-primary text-on-primary rounded-2xl font-headline font-bold text-lg shadow-xl shadow-primary/20 hover:opacity-90 transition-all flex items-center justify-center gap-3 disabled:shadow-none">
              {sending ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                  <span className="material-symbols-outlined">progress_activity</span>
                </motion.div>
              ) : <>Randevu Al <span className="material-symbols-outlined">calendar_add_on</span></>}
            </motion.button>
          </PulseGlow>
        </div>
      </div>
    </>
  )
}

function StepHead({ n, title, done }: { n: number; title: string; done?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <motion.div
        animate={done ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
          done ? "bg-primary text-on-primary" : "bg-primary-container text-primary"
        }`}
      >
        {done ? <span className="material-symbols-outlined text-base">check</span> : n}
      </motion.div>
      <h3 className="font-headline font-bold text-on-surface">{title}</h3>
    </div>
  )
}
