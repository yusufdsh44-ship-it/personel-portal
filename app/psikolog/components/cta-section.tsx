"use client"

import Link from "next/link"
import { FadeInView, motion } from "../../components/motion"

export function CtaSection() {
  return (
    <>
      {/* Chat */}
      <FadeInView>
        <Link href="/sohbet" className="flex items-center gap-4 py-3.5 px-5 rounded-2xl bg-white/50 border border-outline-variant/12 hover:bg-white/70 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-primary text-xl">smart_toy</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-headline font-bold text-on-surface text-sm">Dijital İkizle Konuş</h4>
            <p className="text-xs text-on-surface-variant/70 leading-snug">Randevu, özet talebi, bilgi — 7/24</p>
          </div>
          <motion.span
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="material-symbols-outlined text-primary/40 group-hover:text-primary text-lg transition-colors"
          >arrow_forward</motion.span>
        </Link>
      </FadeInView>

      {/* Randevu */}
      <FadeInView delay={0.05}>
        <Link href="/" className="flex items-center gap-4 py-3.5 px-5 rounded-2xl bg-primary text-on-primary shadow-md shadow-primary/15 hover:opacity-95 transition-all group">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-xl">calendar_add_on</span>
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-headline font-bold text-sm">Hemen Randevu Al</h4>
            <p className="text-xs opacity-70 leading-snug">Size en uygun gün ve saati seçin</p>
          </div>
          <motion.span
            whileHover={{ x: 3 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="material-symbols-outlined text-lg opacity-60"
          >arrow_forward</motion.span>
        </Link>
      </FadeInView>
    </>
  )
}
