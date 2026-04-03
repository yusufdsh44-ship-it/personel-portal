"use client"

import { CountUp, StaggerInView, StaggerItem, motion } from "../../components/motion"
import { STATS } from "../data"

export function StatsBar() {
  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <StaggerInView className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.12}>
        {STATS.map((stat) => (
          <StaggerItem key={stat.label}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="glass-card rounded-2xl p-5 border border-white/40 shadow-sm hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
            >
              {/* Left accent border */}
              <div className="absolute left-0 top-3 bottom-3 w-[2px] bg-primary/40 rounded-full" />

              <div className="pl-3">
                <div className="flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined text-primary/60 text-lg">{stat.icon}</span>
                </div>
                <div className="text-3xl md:text-4xl font-display text-on-surface tracking-tight">
                  <CountUp target={stat.value} suffix={stat.suffix} />
                </div>
                <p className="text-xs text-on-surface-variant font-medium mt-1.5 font-mono uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerInView>
    </section>
  )
}
