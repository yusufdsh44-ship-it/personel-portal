"use client"

import { useRef } from "react"
import Link from "next/link"
import { Header } from "../components/header"
import { FadeIn, FadeInView, StaggerInView, StaggerItem, motion } from "../components/motion"

export default function TestlerPage() {
  const testCardsRef = useRef<HTMLDivElement>(null)

  const scrollToTests = () => {
    testCardsRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
  }

  return (
    <>
      <Header />
      <div className="pt-24 px-6 max-w-4xl mx-auto pb-8">
        {/* Hero */}
        <FadeIn>
          <section className="mb-10 text-center">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex items-center gap-2 bg-primary/5 px-4 py-2 rounded-full mb-6"
            >
              <span className="material-symbols-outlined text-primary text-lg filled">assignment</span>
              <span className="text-xs font-bold text-primary uppercase tracking-wider">Bilimsel Ölçekler</span>
            </motion.div>
            <h1 className="text-4xl font-display text-on-surface mb-4 tracking-tight leading-tight">
              Psikolojik Testler
            </h1>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-xl mx-auto">
              Testler, görüşmelerimizin size özel olmasını sağlar. Sonuçlarınız psikologunuz tarafından titizlikle incelenir ve görüşmelerinizde birlikte değerlendirilir.
            </p>
          </section>
        </FadeIn>

        {/* Test kartları — EN ÜSTTE */}
        <div ref={testCardsRef} className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <FadeIn delay={0.15}>
            <TestCard
              icon="psychology"
              badge="53 SORU"
              title="KSE-53"
              subtitle="Kısa Semptom Envanteri"
              desc="Son bir haftada nasıl hissettiğinizi anlamaya yardımcı olur. Stres, kaygı, uyku, konsantrasyon gibi alanlardaki belirtilerinizi tarayarak psikologunuzun sizi daha iyi anlamasını sağlar."
              href="/testler/kse53"
              pdfUrl="/testler/KSE-53_Testi.pdf"
              duration="~8-10 dk"
              glowDelay={0}
            />
          </FadeIn>
          <FadeIn delay={0.3}>
            <TestCard
              icon="analytics"
              badge="60 SORU"
              title="BFI-2"
              subtitle="Beş Faktör Kişilik Envanteri"
              desc="Kişilik yapınızı bilimsel olarak haritalandırır. Güçlü yönlerinizi ve gelişim alanlarınızı ortaya koyarak destek planınızın size en uygun şekilde hazırlanmasına katkı sağlar."
              href="/testler/bfi2"
              pdfUrl="/testler/BFI-2_Testi.pdf"
              duration="~12-15 dk"
              glowDelay={1.5}
            />
          </FadeIn>
        </div>

        {/* Gizlilik + Yontem bilgi kartlari */}
        <StaggerInView className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10" stagger={0.1}>
          <StaggerItem>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-2xl px-5 py-4 h-full"
            >
              <span className="material-symbols-outlined text-primary text-2xl filled">shield</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Tamamen Gizli</p>
                <p className="text-[11px] text-on-surface-variant leading-snug">Sonuçları yalnızca psikologunuz görür, kimseyle paylaşılmaz</p>
              </div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div
              onClick={scrollToTests}
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 bg-secondary/5 border border-secondary/10 rounded-2xl px-5 py-4 h-full cursor-pointer"
            >
              <span className="material-symbols-outlined text-secondary text-2xl">devices</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Online veya Çıktı</p>
                <p className="text-[11px] text-on-surface-variant leading-snug">Online doldurun veya PDF çıktı alıp elden teslim edin</p>
              </div>
            </motion.div>
          </StaggerItem>
          <StaggerItem>
            <motion.div
              whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="flex items-center gap-3 bg-tertiary/5 border border-tertiary/10 rounded-2xl px-5 py-4 h-full"
            >
              <span className="material-symbols-outlined text-tertiary text-2xl">tune</span>
              <div>
                <p className="text-sm font-bold text-on-surface">Size Özel Plan</p>
                <p className="text-[11px] text-on-surface-variant leading-snug">Test sonuçlarına göre kişiye özel destek planı oluşturulur</p>
              </div>
            </motion.div>
          </StaggerItem>
        </StaggerInView>

        {/* Neden onemli — callout */}
        <FadeInView>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 border border-primary/10 p-6 sm:p-8 mb-10">
            <div className="relative z-10">
              <h2 className="font-headline font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">lightbulb</span>
                Test Sonuçlarınız Ne İşe Yarar?
              </h2>
              <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed">
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">person_search</span>
                  <p><strong className="text-on-surface">Görüşmeler size özel olur.</strong> Psikologunuz test sonuçlarınızı titizlikle inceler ve görüşmenizi sizin ihtiyaçlarınıza göre planlar. Genel bir sohbet yerine, doğrudan sizi ilgilendiren konulara odaklanırız.</p>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">speed</span>
                  <p><strong className="text-on-surface">Süreciniz hızlanır.</strong> Testler, görüşmelerde &ldquo;nereden başlayalım?&rdquo; sorusunu ortadan kaldırır. Psikologunuz durumunuzu önceden anlayarak ilk görüşmeden itibaren verimli bir şekilde çalışmaya başlar.</p>
                </div>
                <div className="flex gap-3">
                  <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">assignment_turned_in</span>
                  <p><strong className="text-on-surface">Kişiye özel plan çıkar.</strong> Sonuçlarınıza göre bilimsel temelli, size özel bir destek planı oluşturulur. Bu plan görüşmelerinizin yol haritasıdır ve birlikte değerlendirilir.</p>
                </div>
                <div className="pt-2 border-t border-primary/10">
                  <p className="text-xs text-on-surface-variant/70 italic">
                    <span className="material-symbols-outlined text-xs align-middle mr-1">info</span>
                    Bu testler teşhis koymaz. Sizi daha iyi anlamamıza ve destek sürecini kişiselleştirmemize yardımcı olan bilimsel araçlardır. Sonuçlar yalnızca psikologunuz tarafından görülür.
                  </p>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
          </div>
        </FadeInView>

        {/* Surec aciklamasi */}
        <FadeInView>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 text-center mb-8">
            <Step n="1" text="Testi doldurun" icon="edit_note" />
            <span className="material-symbols-outlined text-outline-variant/30 text-sm hidden sm:block">arrow_forward</span>
            <Step n="2" text="Psikologunuz detaylı inceler" icon="person_search" />
            <span className="material-symbols-outlined text-outline-variant/30 text-sm hidden sm:block">arrow_forward</span>
            <Step n="3" text="Görüşmenizde birlikte konuşulur" icon="handshake" />
          </div>
        </FadeInView>

        <FadeInView delay={0.1}>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-surface-container-high/40 text-on-surface-variant text-sm font-medium">
              <span className="material-symbols-outlined text-lg filled">lock</span>
              <span>Verileriniz 256-bit şifreleme ile korunmaktadır</span>
            </div>
          </div>
        </FadeInView>
      </div>
    </>
  )
}

function Step({ n, text, icon }: { n: string; text: string; icon: string }) {
  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="flex items-center gap-2.5 bg-surface-lowest px-4 py-2.5 rounded-2xl border border-outline-variant/10"
    >
      <div className="w-7 h-7 rounded-full bg-primary-container text-primary flex items-center justify-center text-xs font-bold">{n}</div>
      <span className="material-symbols-outlined text-primary text-lg">{icon}</span>
      <span className="text-xs font-semibold text-on-surface">{text}</span>
    </motion.div>
  )
}

function TestCard({ icon, badge, title, subtitle, desc, href, pdfUrl, duration, glowDelay = 0 }: {
  icon: string; badge: string; title: string; subtitle: string; desc: string; href: string; pdfUrl: string; duration: string; glowDelay?: number
}) {
  return (
    <motion.div
      animate={{
        y: [0, -5, 0],
        boxShadow: [
          "0 4px 24px rgba(41,104,104,0.04), 0 0 0 1px rgba(41,104,104,0.08)",
          "0 12px 48px rgba(41,104,104,0.14), 0 0 0 1.5px rgba(41,104,104,0.2)",
          "0 4px 24px rgba(41,104,104,0.04), 0 0 0 1px rgba(41,104,104,0.08)",
        ],
      }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: glowDelay }}
      whileHover={{ y: -10, boxShadow: "0 24px 64px rgba(41,104,104,0.18), 0 0 0 2px rgba(41,104,104,0.25)" }}
      className="group relative flex flex-col bg-surface-lowest p-8 rounded-[2.5rem] overflow-hidden h-full cursor-pointer"
    >
      <div className="flex items-start justify-between mb-6">
        <motion.div
          animate={{ rotate: [0, 3, -3, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: glowDelay + 0.5 }}
          className="p-3 bg-primary-container/30 rounded-2xl text-primary"
        >
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </motion.div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-surface-container-high/60 text-on-surface-variant text-[10px] font-bold flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">timer</span>{duration}
          </span>
          <span className="px-3 py-1 rounded-full bg-secondary-container/50 text-on-surface-variant text-[10px] font-bold">{badge}</span>
        </div>
      </div>
      <h3 className="text-2xl font-bold font-headline text-on-surface mb-0.5 leading-tight group-hover:text-primary transition-colors">{title}</h3>
      <p className="text-xs text-primary font-medium mb-3">{subtitle}</p>
      <p className="text-on-surface-variant text-sm leading-relaxed mb-8 flex-grow">{desc}</p>
      <div className="space-y-3">
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(41,104,104,0)",
              "0 0 20px 4px rgba(41,104,104,0.15)",
              "0 0 0 0 rgba(41,104,104,0)",
            ],
          }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: glowDelay + 1 }}
          className="rounded-2xl"
        >
          <Link href={href}
            className="w-full h-14 bg-primary text-on-primary rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-black/5 active:scale-95">
            <span>Online Doldur</span>
            <motion.span
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut", delay: glowDelay + 2 }}
              className="material-symbols-outlined text-xl"
            >
              arrow_forward
            </motion.span>
          </Link>
        </motion.div>
        <a href={pdfUrl} download
          className="w-full h-12 bg-surface-container-low text-on-surface-variant rounded-2xl font-medium flex items-center justify-center gap-2 transition-all duration-300 hover:bg-surface-container-high active:scale-95 text-sm border border-outline-variant/10">
          <span className="material-symbols-outlined text-lg">download</span>
          <span>PDF İndir (Kağıt Doldurmak İçin)</span>
        </a>
        <p className="text-[10px] text-on-surface-variant text-center mt-2 leading-snug">
          Kağıt testi doldurup görüşme günü yanınızda getirin
        </p>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
    </motion.div>
  )
}
