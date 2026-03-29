"use client"

import { FadeInView, StaggerInView, StaggerItem, motion } from "../../components/motion"
import { YETKINLIKLER } from "../data"

export function CompetenciesSection() {
  return (
    <section className="bg-primary/[0.02] py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6 space-y-8">
        <FadeInView>
          <h3 className="text-2xl font-headline font-bold text-on-surface">Yetkinlikler</h3>
        </FadeInView>

        <StaggerInView className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" stagger={0.1}>
          {YETKINLIKLER.map(({ kategori, icon, items }) => (
            <StaggerItem key={kategori}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                className="glass-card rounded-2xl p-5 space-y-3 border border-white/60 hover:border-primary/20 transition-colors duration-300 h-full"
              >
                <div className="flex items-center gap-2">
                  <motion.span
                    whileHover={{ rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="material-symbols-outlined text-primary text-xl"
                  >
                    {icon}
                  </motion.span>
                  <h4 className="text-xs font-bold text-primary uppercase tracking-widest">{kategori}</h4>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {items.map(item => (
                    <motion.span
                      key={item}
                      whileHover={{ scale: 1.05, backgroundColor: "var(--primary-container)" }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface-variant text-xs font-medium cursor-default"
                    >
                      {item}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerInView>
      </div>
    </section>
  )
}
