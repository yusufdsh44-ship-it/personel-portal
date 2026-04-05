"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import Link from "next/link"

/* ═══════════════════════════════════════════
   SLIDE DATA
   ═══════════════════════════════════════════ */

interface SlideData {
  id: string
  icon: string
  label: string
  title: string
  content: React.ReactNode
  accent: string
  barColor: string
  bulletColor: string
  light?: boolean
  video?: string        // arka plan video URL
  iconFilled?: boolean
}

function Pill({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 bg-white/20 text-white font-bold rounded-md px-2 py-0.5 hover:bg-white/30 active:scale-95 transition-all text-[0.85em] leading-normal border border-white/10">
      <span className="material-symbols-outlined" style={{ fontSize: "0.9em" }}>{icon}</span>
      {children}
    </Link>
  )
}

function PillDark({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 bg-primary/10 text-primary font-bold rounded-md px-2 py-0.5 hover:bg-primary/15 active:scale-95 transition-all text-[0.85em] leading-normal border border-primary/15">
      <span className="material-symbols-outlined" style={{ fontSize: "0.9em" }}>{icon}</span>
      {children}
    </Link>
  )
}

const SLIDES: SlideData[] = [
  {
    id: "giris",
    icon: "waving_hand",
    label: "Hoş Geldiniz",
    title: "Merhaba, ben Yusuf.",
    accent: "from-[#2a1810] via-[#3d2518] to-[#5a3420]",
    video: "/hero-video.mp4",
    barColor: "from-[#b5694d] via-[#c47a4a] to-[#d4956a]",
    bulletColor: "#d4956a",
    iconFilled: true,
    content: (
      <p className="leading-[1.9] text-white/80">
        Müdürlük ziyaretlerinde sizlerle tanışmak ve çalışan memnuniyeti anketiyle kurumu yakından tanımak benim için çok değerliydi. Şimdi <strong className="text-white font-semibold">bir adım öteye geçip sizinle birebir görüşmek</strong>, sizi yakından tanımak ve birlikte neler yapabileceğimizi konuşmak isterim.
      </p>
    ),
  },
  {
    id: "ilk-adim",
    icon: "target",
    label: "Sürecin İlk Adımı",
    title: "Sürecin İlk Adımı",
    accent: "from-[#1a3a4a] via-[#1e4d5e] to-[#2a6070]",
    barColor: "from-[#2a6070] via-[#4a90a0] to-[#6ab0c0]",
    bulletColor: "#6ab0c0",
    content: (
      <div className="text-white/80 text-[13px] sm:text-sm leading-[1.65] sm:leading-[1.7]">
        <p className="mb-3">Belediyemizdeki <strong className="text-white font-semibold">2.238 personelin her biriyle bire bir tanışma görüşmesi</strong> gerçekleştiriyorum. Görüşme sırası müdürlüğünüze geldiğinde süreç üç adımda ilerliyor:</p>

        {/* Timeline — animasyonlu dikey çizgi */}
        <div className="relative ml-3.5">
          {/* Statik arka plan çizgi */}
          <div className="absolute left-[13px] top-3 bottom-3 w-px bg-[#6ab0c0]/15" />
          {/* Animasyonlu dolma çizgisi */}
          <motion.div
            className="absolute left-[13px] top-3 bottom-3 w-px bg-[#6ab0c0]/60 origin-top"
            animate={{ scaleY: [0, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />
          {/* Akan ışık noktası */}
          <motion.div
            className="absolute left-[11px] w-[7px] h-[7px] rounded-full bg-[#6ab0c0] shadow-[0_0_8px_2px_rgba(106,176,192,0.5)]"
            animate={{ top: ["12px", "calc(100% - 12px)"] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />

          {[
            { n: 1, text: <>İlk olarak <strong className="text-white font-semibold">KSE-53 ve BFI-2 testlerini</strong> <Pill href="/testler" icon="assignment">Testler</Pill> sayfasından online doldurabilir ya da PDF çıktısını alıp elden getirebilirsiniz. Testler görüşmenin temelini oluşturduğu için <strong className="text-white font-semibold">randevu öncesinde tamamlanması gerekmektedir</strong>.</> },
            { n: 2, text: <>Testlerinizi tamamladıktan sonra <Pill href="/randevu" icon="event_available">Randevu</Pill> sayfasından veya <Pill href="/sohbet" icon="smart_toy">Chat</Pill> üzerinden dijital ikizimle konuşarak randevunuzu kolayca oluşturabilirsiniz.</> },
            { n: 3, text: <><strong className="text-white font-semibold">Randevu sonrası size özel bir referans numarası</strong> verilecek — iptal, değişiklik ve size özel birçok özellik bu numara ile kullanılabilir. <strong className="text-white font-semibold">Lütfen saklayın.</strong></> },
          ].map((step) => (
            <div key={step.n} className="relative flex gap-2.5 pb-2.5 last:pb-0">
              {/* Numara — sırayla parlayan pulse */}
              <motion.div
                className="relative z-10 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#6ab0c0] text-[#1a3a4a] flex items-center justify-center shrink-0 text-[10px] sm:text-[11px] font-bold font-mono -ml-0.5"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(106,176,192,0.1)",
                    "0 0 12px 4px rgba(106,176,192,0.5)",
                    "0 0 0 0 rgba(106,176,192,0.1)",
                  ],
                  scale: [1, 1.15, 1],
                }}
                transition={{
                  duration: 1.2,
                  delay: (step.n - 1) * 1.3,
                  repeat: Infinity,
                  repeatDelay: 4 - 1.2 + (3 - step.n) * 1.3,
                  ease: "easeInOut",
                }}
              >
                {step.n}
              </motion.div>
              <span className="pt-0.5">{step.text}</span>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    id: "gorusme",
    icon: "handshake",
    label: "Görüşme",
    title: "Görüşme — Size Özel",
    accent: "from-[#7a4a2a] via-[#9a5a35] to-[#c47a4a]",
    barColor: "from-[#c47a4a] via-[#d4956a] to-[#e0b090]",
    bulletColor: "#e0b090",
    content: (
      <ul className="space-y-5 text-white/80 leading-[1.9]">
        {[
          { icon: "person_search", text: <>Ben testlerinizi <strong className="text-white font-semibold">görüşmeden önce detaylıca inceliyorum</strong>. Böylece karşılaştığımızda sıfırdan değil, <strong className="text-white font-semibold">önde başlıyoruz</strong>.</> },
          { icon: "diversity_1", text: <>Kişilik yapınızı, sizi siz yapan dinamikleri birlikte keşfediyor, güçlü yönlerinizi birlikte fark ediyoruz.</> },
        ].map((item, i) => (
          <motion.li key={i} className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.4 }}
          >
            <motion.span
              className="material-symbols-outlined text-[#e0b090] mt-0.5 shrink-0 text-lg"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 0.8, delay: 1 + i * 0.4, repeat: Infinity, repeatDelay: 4 }}
            >{item.icon}</motion.span>
            <span>{item.text}</span>
          </motion.li>
        ))}
      </ul>
    ),
  },
  {
    id: "ozet",
    icon: "description",
    label: "Kişisel Özet",
    title: "Görüşme Sonrası — Kişisel Özetiniz",
    accent: "from-[#2d1b3d] via-[#4a2d5e] to-[#6b3f7a]",
    barColor: "from-[#6b3f7a] via-[#9060a0] to-[#b080c0]",
    bulletColor: "#b080c0",
    content: (
      <ul className="space-y-5 text-white/80 leading-[1.9]">
        {[
          { icon: "note_alt", text: <>Talep eden personelimiz için <strong className="text-white font-semibold">kişisel bir özet</strong> hazırlıyorum: güçlü yönleriniz, birlikte belirlediğimiz adımlar ve size özel kitap önerileri. Böylece konuştuklarımız sadece o ana ait kalmıyor, <strong className="text-white font-semibold">her zaman sizde kalıyor</strong>. Devam etmek isterseniz de her şeyi baştan anlatmanıza gerek kalmıyor.</> },
          { icon: "handshake", text: <>Bu özeti görüşmemizin ardından <strong className="text-white font-semibold">birkaç gün içinde elden teslim</strong> alabilirsiniz.</> },
        ].map((item, i) => (
          <motion.li key={i} className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.4 }}
          >
            <motion.span
              className="material-symbols-outlined text-[#b080c0] mt-0.5 shrink-0 text-lg"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.2, delay: 1 + i * 0.5, repeat: Infinity, repeatDelay: 4 }}
            >{item.icon}</motion.span>
            <span>{item.text}</span>
          </motion.li>
        ))}
      </ul>
    ),
  },
  {
    id: "duzenli",
    icon: "event_repeat",
    label: "Düzenli Görüşme",
    title: "Düzenli Görüşmeler",
    accent: "from-[#1a3328] via-[#264a3a] to-[#3a6650]",
    barColor: "from-[#3a6650] via-[#5a9070] to-[#80b898]",
    bulletColor: "#80b898",
    content: (
      <ul className="space-y-5 text-white/80 leading-[1.9]">
        {[
          { icon: "groups", text: <>İlk görüşme <strong className="text-white font-semibold">tüm personelimizi</strong> kapsıyor.</> },
          { icon: "sync", text: <>Sonrasında, ortaya çıkan farkındalıkları derinleştirmek ve birlikte belirlediğimiz adımları takip etmek isteyen personelimizle <strong className="text-white font-semibold">düzenli görüşmelere</strong> devam ediyorum.</> },
        ].map((item, i) => (
          <motion.li key={i} className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.4 }}
          >
            <motion.span
              className="material-symbols-outlined text-[#80b898] mt-0.5 shrink-0 text-lg"
              animate={i === 1 ? { rotate: [0, 360] } : { scale: [1, 1.2, 1] }}
              transition={i === 1
                ? { duration: 4, repeat: Infinity, ease: "linear" }
                : { duration: 1, delay: 1, repeat: Infinity, repeatDelay: 4 }
              }
            >{item.icon}</motion.span>
            <span>{item.text}</span>
          </motion.li>
        ))}
      </ul>
    ),
  },
  {
    id: "dijital-ikiz",
    icon: "smart_toy",
    label: "Dijital İkiz",
    title: "Dijital İkiz — 7/24 Yanınızda",
    accent: "from-[#0f2b3d] via-[#163d55] to-[#1e5570]",
    barColor: "from-[#1e5570] via-[#3a8aa0] to-[#60b8d0]",
    bulletColor: "#60b8d0",
    content: (
      <div className="space-y-5 text-white/80 leading-[1.9]">
        {/* Typing indicator */}
        <motion.div className="flex items-center gap-1.5 mb-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-[#60b8d0]/15 border border-[#60b8d0]/20">
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                className="w-2 h-2 rounded-full bg-[#60b8d0]"
                animate={{ y: [0, -6, 0], opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity, repeatDelay: 0.6 }}
              />
            ))}
          </div>
          <span className="text-[#60b8d0]/60 text-xs font-mono">7/24 aktif</span>
        </motion.div>

        <ul className="space-y-4">
          {[
            { text: <><Pill href="/sohbet" icon="smart_toy">Chat</Pill> sayfasındaki dijital ikizim üzerinden <strong className="text-white font-semibold">randevunuzla ilgili her işlemi</strong> yapabilirsiniz.</> },
            { text: <>Süreç hakkında bilgi edinebilir ya da aklınıza takılan her şeyi sorabilirsiniz.</> },
            { text: <>Mesai saati gözetmeksizin, <strong className="text-white font-semibold">günün her saati</strong>.</> },
          ].map((item, i) => (
            <motion.li key={i} className="flex gap-3 items-start"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.8 + i * 0.3 }}
            >
              <motion.span
                className="material-symbols-outlined text-[#60b8d0] mt-0.5 shrink-0 text-lg"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
              >chat_bubble</motion.span>
              <span>{item.text}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "ulasim",
    icon: "mail",
    label: "İletişim",
    title: "Her Zaman Ulaşabilirsiniz",
    accent: "from-[#4a2a1a] via-[#6b3d28] to-[#8B5E3C]",
    barColor: "from-[#8B5E3C] via-[#b5694d] to-[#d4956a]",
    bulletColor: "#d4956a",
    content: (
      <ul className="space-y-5 text-white/80 leading-[1.9]">
        {[
          { icon: "send", text: <>Aşağıdaki <Pill href="/mesaj" icon="edit_note">Mesaj</Pill> kısmından veya <Pill href="/sohbet" icon="smart_toy">Chat</Pill> kısmından <strong className="text-white font-semibold">anonim ya da isimli</strong> olarak bana ulaşabilirsiniz.</> },
          { icon: "mark_email_read", text: <>Mesajlarınızı okuyor ve <strong className="text-white font-semibold">en kısa sürede dönüş yapıyorum</strong>.</> },
        ].map((item, i) => (
          <motion.li key={i} className="flex gap-3 items-start"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.4 }}
          >
            <motion.span
              className="material-symbols-outlined text-[#d4956a] mt-0.5 shrink-0 text-lg"
              animate={i === 0 ? { x: [0, 4, 0], y: [0, -3, 0] } : { scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 1 + i }}
            >{item.icon}</motion.span>
            <span>{item.text}</span>
          </motion.li>
        ))}
      </ul>
    ),
  },
  {
    id: "gizlilik",
    icon: "verified_user",
    label: "Gizlilik",
    title: "Gizlilik",
    accent: "from-[#1a1a2e] via-[#2a2a45] to-[#3d3d60]",
    barColor: "from-[#3d3d60] via-[#6060a0] to-[#8888cc]",
    bulletColor: "#8888cc",
    iconFilled: true,
    content: (
      <ul className="space-y-4 text-white/80 leading-[1.9]">
        {[
          { icon: "lock", text: <>Testleriniz, görüşmelerimiz ve tüm notlar <strong className="text-white font-semibold">yalnızca bende kalır</strong>.</> },
          { icon: "block", text: <>Amiriniz veya müdürünüz bu bilgilere <strong className="text-white font-semibold">erişemez</strong>.</> },
          { icon: "encrypted", text: <>Tüm veriler <strong className="text-white font-semibold">256-bit şifreleme</strong> ile korunur. Bu mesleki etik kurallarımın gereği.</> },
        ].map((item, i) => (
          <motion.li key={i} className="flex gap-3 items-start"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.35 }}
          >
            <motion.span
              className="material-symbols-outlined text-[#8888cc] mt-0.5 shrink-0 text-lg filled"
              animate={{ scale: [1, 1.25, 1], opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 1.5, delay: 1.2 + i * 0.5, repeat: Infinity, repeatDelay: 3 }}
            >{item.icon}</motion.span>
            <span>{item.text}</span>
          </motion.li>
        ))}
      </ul>
    ),
  },
  {
    id: "kapanis",
    icon: "psychology",
    label: "Kapanış",
    title: "Görüşmek dileğiyle.",
    accent: "from-[#2a1810] via-[#3d2518] to-[#5a3420]",
    barColor: "from-[#b5694d] via-[#c47a4a] to-[#d4956a]",
    bulletColor: "#d4956a",
    content: (
      <div className="text-center space-y-6">
        {/* İsim */}
        <div className="space-y-3">
          <p className="text-2xl sm:text-3xl font-display text-white tracking-tight">Uzm. Kl. Psk. Yusuf Pamuk</p>
          <div className="flex items-center justify-center gap-3">
            <div className="w-8 h-px bg-[#d4956a]/30" />
            <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">Kurumsal Psikoloji Birimi</span>
            <div className="w-8 h-px bg-[#d4956a]/30" />
          </div>
          <p className="text-white/35 text-xs flex items-center justify-center gap-1">
            <span className="material-symbols-outlined text-xs">schedule</span>
            Pzt–Cum 09:00–17:00
          </p>
        </div>

        {/* CTA butonları — yatay, eşit genişlik */}
        <div className="flex justify-center gap-2 max-w-xs mx-auto">
          <Link href="/testler" className="flex-1 py-3 rounded-xl bg-white/8 text-white/90 font-semibold text-xs hover:bg-white/15 active:scale-95 transition-all border border-white/10 flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-sm">assignment</span>
            Testler
          </Link>
          <Link href="/randevu" className="flex-1 py-3 rounded-xl bg-white/8 text-white/90 font-semibold text-xs hover:bg-white/15 active:scale-95 transition-all border border-white/10 flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-sm">calendar_add_on</span>
            Randevu
          </Link>
          <Link href="/sohbet" className="flex-1 py-3 rounded-xl bg-white text-[#2a1810] font-bold text-xs hover:bg-white/90 active:scale-95 transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-white/10">
            <span className="material-symbols-outlined text-sm">smart_toy</span>
            Chat
          </Link>
        </div>

        {/* Psikolog kimdir? */}
        <button
          onClick={() => document.getElementById("slide-psikolog-kimdir")?.scrollIntoView({ behavior: "smooth" })}
          className="inline-flex items-center gap-1.5 text-white/30 text-[11px] hover:text-white/50 transition-colors group"
        >
          <span className="material-symbols-outlined text-sm">person</span>
          Kurumsal Psikolog (Yusuf Pamuk) Kimdir?
          <motion.span
            animate={{ y: [0, 2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="material-symbols-outlined text-sm group-hover:text-white/50"
          >
            keyboard_arrow_down
          </motion.span>
        </button>
      </div>
    ),
  },
]

/* ═══════════════════════════════════════════
   NAVIGATION DOTS
   ═══════════════════════════════════════════ */

function NavDots({ current, total, onGo }: { current: number; total: number; onGo: (i: number) => void }) {
  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-2 items-center">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGo(i)}
          aria-label={`Slide ${i + 1}: ${SLIDES[i]?.label ?? "Psikolog Kimdir?"}`}
          className="group relative flex items-center"
        >
          <span className={`block rounded-full transition-all duration-300 ${
            i === current
              ? "w-2.5 h-2.5 bg-white shadow-md"
              : "w-1.5 h-1.5 bg-white/30 hover:bg-white/50"
          }`} />
          <span className="absolute right-6 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            {SLIDES[i]?.label ?? "Psikolog Kimdir?"}
          </span>
        </button>
      ))}
    </div>
  )
}

/* ═══════════════════════════════════════════
   SLIDE COMPONENT
   ═══════════════════════════════════════════ */

function Slide({ slide, index, isActive, peekOffset = 0 }: { slide: SlideData; index: number; isActive: boolean; peekOffset?: number }) {
  const reduced = useReducedMotion()
  const isClosing = slide.id === "kapanis"
  const isLight = slide.light
  const hideIcon = isClosing || !slide.title
  const videoRef = useRef<HTMLVideoElement>(null)
  const [muted, setMuted] = useState(true)

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted
      setMuted(videoRef.current.muted)
    }
  }

  // Slide'dan ayrılınca videoyu durdur + sessize al
  useEffect(() => {
    if (!videoRef.current || !slide.video) return
    if (isActive) {
      videoRef.current.play().catch(() => {})
    } else {
      videoRef.current.pause()
      videoRef.current.muted = true
      setMuted(true)
    }
  }, [isActive, slide.video])

  return (
    <section
      id={`slide-${slide.id}`}
      className={`relative w-full h-[100dvh] overflow-hidden flex justify-center snap-start bg-gradient-to-br ${slide.accent} ${
        slide.id === "ilk-adim" ? "items-start pt-[2dvh] lg:items-center lg:pt-0 lg:pb-20" : "items-center pb-20 lg:pb-20"
      }`}
      style={{
        scrollSnapAlign: "start",
        transform: peekOffset ? `translateY(${peekOffset}px)` : undefined,
        transition: "transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      {/* Video arka plan */}
      {slide.video && (
        <>
          {/* Video — Safari + Chrome uyumlu, gizemli arka plan */}
          <video
            ref={videoRef}
            autoPlay
            muted
            loop
            playsInline
            webkit-playsinline="true"
            className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105"
            style={{ filter: "blur(1px) saturate(0.7)" }}
          >
            <source src={slide.video} type="video/mp4" />
          </video>
          {/* Gradient overlay — derinlik + okunabilirlik */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2a1810]/95 via-[#2a1810]/70 to-[#2a1810]/60" />
        </>
      )}

      {/* Decorative circles — sadece koyu slide'larda, video yoksa */}
      {!isLight && !slide.video && (
        <>
          <div className="absolute -top-[30%] -right-[20%] w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.04)_0%,transparent_70%)]" />
          <div className="absolute -bottom-[20%] -left-[10%] w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(255,150,80,0.06)_0%,transparent_70%)]" />
        </>
      )}

      {/* Content */}
      <div
        className="relative z-10 w-full max-w-2xl lg:max-w-4xl mx-auto px-5 sm:px-10 lg:px-16"
        style={slide.video ? { textShadow: "0 2px 20px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.4)" } : undefined}
      >
        {/* Slide number + label */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 10 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={`flex items-center gap-2 ${slide.title ? "mb-2 sm:mb-4" : "mb-1"}`}
        >
          <span className={`font-mono text-xs sm:text-sm tracking-wider ${isLight ? "text-[#8a8580]/40" : "text-white/20"}`}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className={`w-6 h-[1px] ${isLight ? "bg-[#8a8580]/20" : "bg-white/15"}`} />
          <span className={`font-mono text-[10px] sm:text-xs tracking-wider uppercase ${isLight ? "text-[#8a8580]/60" : "text-white/40"}`}>
            {slide.label}
          </span>
        </motion.div>

        {/* Icon */}
        {!hideIcon && (
          <motion.div
            initial={reduced ? {} : { opacity: 0, scale: 0.8 }}
            animate={isActive ? { opacity: 1, scale: 1 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.15 }}
            className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-3 sm:mb-5 ${
              isLight ? "bg-[#b5694d]/10 border border-[#b5694d]/15" : "bg-white/10 border border-white/10"
            }`}
          >
            <span className={`material-symbols-outlined text-xl sm:text-2xl ${isLight ? "text-[#b5694d]" : "text-white"} ${slide.iconFilled ? "filled" : ""}`}>
              {slide.icon}
            </span>
          </motion.div>
        )}

        {/* Title */}
        {slide.title && (
          <motion.h2
            initial={reduced ? {} : { opacity: 0, y: 20 }}
            animate={isActive ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className={`tracking-tight mb-3 sm:mb-6 ${
              isLight ? "text-[#2a1810]" : "text-white"
            } ${isClosing ? "font-display text-lg sm:text-2xl" : slide.id === "giris" ? "font-[family-name:var(--font-caveat)] text-3xl sm:text-5xl" : "font-display text-xl sm:text-4xl"}`}
          >
            {slide.title}
          </motion.h2>
        )}

        {/* Body */}
        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 20 }}
          animate={isActive ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-sm sm:text-base lg:text-lg"
        >
          {slide.content}
        </motion.div>
      </div>

      {/* Ses aç/kapa — sadece video slide'ında */}
      {slide.video && (
        <button
          onClick={toggleMute}
          className="absolute bottom-32 right-5 z-20 w-10 h-10 rounded-full bg-white/15 border border-white/20 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/25 active:scale-90 transition-all"
          aria-label={muted ? "Sesi aç" : "Sesi kapat"}
        >
          <span className="material-symbols-outlined text-lg">{muted ? "volume_off" : "volume_up"}</span>
        </button>
      )}

      {/* Bottom gradient bar */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${slide.barColor}`} />
    </section>
  )
}

/* ═══════════════════════════════════════════
   MAIN PRESENTATION
   ═══════════════════════════════════════════ */

export function SlidesPresentation() {
  const [current, setCurrent] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const hasInteracted = useRef(false)
  const [showSwipeHint, setShowSwipeHint] = useState(false)
  const [peekOffset, setPeekOffset] = useState(0)

  // Instagram-style peek — tüm slide hafifçe yukarı kayar, geri döner
  useEffect(() => {
    if (current !== 0) return
    const container = containerRef.current
    if (!container) return

    const cancel = () => { hasInteracted.current = true; setShowSwipeHint(false); setPeekOffset(0) }
    // Sadece gerçek scroll veya wheel ile iptal — buton dokunmalarında değil
    const onScroll = () => { if (container.scrollTop > 10) cancel() }
    container.addEventListener("scroll", onScroll, { passive: true })
    container.addEventListener("wheel", cancel, { once: true })

    const timers: ReturnType<typeof setTimeout>[] = []
    const peek = (delay: number) => {
      timers.push(setTimeout(() => {
        if (hasInteracted.current) return
        setPeekOffset(-50)
        setShowSwipeHint(true)
      }, delay))
      timers.push(setTimeout(() => {
        if (hasInteracted.current) return
        setPeekOffset(0)
      }, delay + 900))
      timers.push(setTimeout(() => {
        if (hasInteracted.current) return
        setShowSwipeHint(false)
      }, delay + 1400))
    }

    peek(3500)
    peek(10000)
    peek(16500)

    return () => {
      timers.forEach(clearTimeout)
      container.removeEventListener("scroll", onScroll)
      container.removeEventListener("wheel", cancel)
    }
  }, [current])

  // Track current slide via Intersection Observer
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio > 0.5) {
            const idx = Array.from(container.children).indexOf(entry.target as HTMLElement)
            if (idx >= 0) setCurrent(idx)
          }
        }
      },
      { root: container, threshold: 0.5 }
    )

    Array.from(container.children).forEach((child) => observer.observe(child))
    return () => observer.disconnect()
  }, [])

  // Navigate to slide
  const goTo = useCallback((i: number) => {
    const container = containerRef.current
    if (!container || i < 0 || i >= SLIDES.length) return
    const slide = container.children[i] as HTMLElement
    slide?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // Horizontal swipe → vertical scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    let startX = 0
    let startY = 0
    const onStart = (e: TouchEvent) => { startX = e.touches[0].clientX; startY = e.touches[0].clientY }
    const onEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX
      const dy = e.changedTouches[0].clientY - startY
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) goTo(current + 1) // sola kaydır → sonraki
        else goTo(current - 1) // sağa kaydır → önceki
      }
    }
    container.addEventListener("touchstart", onStart, { passive: true })
    container.addEventListener("touchend", onEnd, { passive: true })
    return () => { container.removeEventListener("touchstart", onStart); container.removeEventListener("touchend", onEnd) }
  }, [current, goTo])

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault()
        goTo(current + 1)
      }
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault()
        goTo(current - 1)
      }
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [current, goTo])

  return (
    <div className="fixed inset-0 z-10">
      {/* Slides container */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto snap-y snap-mandatory no-scrollbar"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {SLIDES.map((slide, i) => (
          <Slide key={slide.id} slide={slide} index={i} isActive={current === i} peekOffset={i === 0 ? peekOffset : 0} />
        ))}

        {/* CV Slide — özel layout */}
        <CvSlide />
      </div>

      {/* Navigation dots */}
      <NavDots current={current} total={SLIDES.length + 1} onGo={(i) => {
        if (i < SLIDES.length) goTo(i)
        else document.getElementById("slide-psikolog-kimdir")?.scrollIntoView({ behavior: "smooth" })
      }} />

      {/* Scroll hint */}
      <AnimatePresence>
        {current < SLIDES.length && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => goTo(current + 1)}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1 cursor-pointer"
          >
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className={`material-symbols-outlined ${current === 0 ? "text-white/40 text-2xl" : "text-white/25 text-lg"}`}
            >
              expand_more
            </motion.span>
            {/* "Kaydır" yazısı — peek animasyonu sırasında belirir */}
            <AnimatePresence>
              {showSwipeHint && current === 0 && (
                <motion.span
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.3 }}
                  className="text-[11px] font-mono text-white/50 tracking-widest uppercase"
                >
                  Kaydır
                </motion.span>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ═══════════════════════════════════════════
   CV SLIDE — Özel tam sayfa layout
   ═══════════════════════════════════════════ */

function CvItem({ logo, fallback, title, sub }: { logo?: string; fallback?: string; title: string; sub: string }) {
  return (
    <div className="flex items-center gap-2.5 lg:gap-4">
      <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-lg lg:rounded-xl bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-[#e8e0d8]/60">
        {logo ? <img src={logo} alt="" className="w-7 h-7 lg:w-9 lg:h-9 object-contain" /> : <span className="text-[#b5694d]/40 text-[9px] lg:text-xs font-bold">{fallback}</span>}
      </div>
      <div className="min-w-0">
        <p className="text-[#2a1810] font-semibold text-[13px] lg:text-base leading-tight truncate">{title}</p>
        <p className="text-[#8a8580] text-[11px] lg:text-sm leading-snug">{sub}</p>
      </div>
    </div>
  )
}

function CvSection({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-[11px] lg:text-sm font-bold text-[#b5694d] flex items-center gap-1.5 lg:gap-2 mb-2 lg:mb-4 uppercase tracking-wider font-mono">
        <span className="material-symbols-outlined text-base lg:text-xl">{icon}</span> {title}
      </h3>
      <div className="space-y-1.5 lg:space-y-3.5">
        {children}
      </div>
    </div>
  )
}

function CvSlide() {
  return (
    <section
      id="slide-psikolog-kimdir"
      className="relative w-full h-[100dvh] overflow-hidden snap-start bg-gradient-to-br from-[#f5f0eb] to-[#ede5dd] flex flex-col"
      style={{ scrollSnapAlign: "start" }}
    >
      {/* Header — kompakt */}
      <div className="text-center pt-5 sm:pt-10 pb-2 sm:pb-4 px-5">
        <p className="font-mono text-[10px] text-[#8a8580] tracking-wider uppercase mb-0.5">Kurumsal Psikolog</p>
        <p className="font-display text-[#2a1810] text-xl sm:text-3xl lg:text-4xl tracking-tight">Yusuf Pamuk</p>
      </div>

      {/* Grid — 3 kolon desktop, tek kolon mobil */}
      <div className="flex-1 overflow-hidden px-5 sm:px-8 lg:px-16 pb-3">
        <div className="max-w-4xl lg:max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6 lg:gap-12 content-start">
          {/* Kolon 1: Eğitim */}
          <CvSection icon="school" title="Eğitim">
            <CvItem logo="/logos/galatasaray.png" title="Galatasaray Üniversitesi" sub="Stratejik İletişim — Yüksek Lisans · Devam" />
            <CvItem logo="/logos/uskudar.webp" title="Üsküdar Üniversitesi" sub="Klinik Psikoloji — Yüksek Lisans · Onur Derecesi" />
            <CvItem logo="/logos/medipol.svg" title="Medipol Üniversitesi" sub="Psikoloji — Lisans · Onur Derecesi" />
            <CvItem fallback="UT" title="Università degli Studi di Torino" sub="Erasmus Stajı — Psikoloji · İtalya" />
          </CvSection>

          {/* Kolon 2: Klinik Deneyim */}
          <CvSection icon="work" title="Klinik Deneyim">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-sm border border-[#e8e0d8]/60">
                <img src="/logos/arnavutkoy.png" alt="" className="w-7 h-7 object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="text-[#2a1810] font-semibold text-[13px] leading-tight truncate">Arnavutköy Belediyesi</p>
                  <span className="text-[8px] font-mono bg-[#b5694d]/10 text-[#b5694d] px-1.5 py-0.5 rounded shrink-0 font-bold">AKTİF</span>
                </div>
                <p className="text-[#8a8580] text-[11px] leading-snug">Kurum Psikoloğu — Kurumsal Psikoloji Birimi</p>
              </div>
            </div>
            <CvItem logo="/logos/frenchlape.png" title="Fransız Lape Psikiyatri Hastanesi" sub="Klinik Psikolog" />
            <CvItem logo="/logos/enerji-bakanligi.png" title="Enerji ve Tabii Kaynaklar Bakanlığı (TÜNAŞ)" sub="Kurum Psikoloğu" />
            <CvItem logo="/logos/npistanbul.png" title="NP İstanbul Beyin Hastanesi" sub="Klinik Psikolog" />
            <CvItem logo="/logos/taksim-eah.jpg" title="Taksim Eğitim ve Araştırma Hastanesi" sub="Stajyer Psikolog" />
          </CvSection>

          {/* Kolon 3: Programlar */}
          <CvSection icon="flight_takeoff" title="Programlar">
            <CvItem logo="/logos/seta.png" title="SETA Vakfı" sub="Araştırmacı Stajyer — Avrupa Çalışmaları" />
            <CvItem fallback="W" title="WAT — ABD, New York" sub="Kültürel Değişim Programı" />
          </CvSection>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-1 bg-gradient-to-r from-[#b5694d] via-[#c47a4a] to-[#d4956a]" />
    </section>
  )
}
