"use client"

import { FadeInView, StaggerInView, StaggerItem, motion } from "../../components/motion"
import { EGITIM, PROGRAMLAR, DENEYIM, type EgitimItem, type DeneyimItem } from "../data"

export function TimelineSection() {
  return (
    <section className="bg-white/30 py-16 md:py-20">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Egitim */}
          <div className="space-y-8">
            <FadeInView>
              <h3 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">school</span> Egitim
              </h3>
            </FadeInView>

            <div className="space-y-7 relative">
              {/* Animated vertical line */}
              <div className="absolute left-[2.25rem] top-3 bottom-3 w-[2px] bg-primary-container" />

              {EGITIM.map((item, i) => (
                <FadeInView key={item.title} delay={i * 0.12}>
                  <TimelineItem {...item} />
                </FadeInView>
              ))}
            </div>

            <FadeInView delay={0.3}>
              <h3 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2 mt-10">
                <span className="material-symbols-outlined text-primary">flight_takeoff</span> Programlar
              </h3>
            </FadeInView>

            <div className="space-y-7 relative">
              <div className="absolute left-5 top-3 bottom-3 w-[2px] bg-primary-container" />
              {PROGRAMLAR.map((item, i) => (
                <FadeInView key={item.title} delay={0.4 + i * 0.12}>
                  <TimelineItem {...item} />
                </FadeInView>
              ))}
            </div>
          </div>

          {/* Deneyim */}
          <div className="space-y-8">
            <FadeInView>
              <h3 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">work</span> Klinik Deneyim
              </h3>
            </FadeInView>

            <StaggerInView className="space-y-4" stagger={0.1}>
              {DENEYIM.map((item) => (
                <StaggerItem key={item.title}>
                  <ExperienceCard {...item} />
                </StaggerItem>
              ))}
            </StaggerInView>
          </div>
        </div>
      </div>
    </section>
  )
}

function TimelineItem({ logo, title, sub, meta }: EgitimItem) {
  return (
    <div className="relative pl-24">
      {/* Dot on line */}
      <div className="absolute left-[1.85rem] top-4 w-2 h-2 rounded-full bg-primary/40" />

      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
        className="absolute left-0 top-0 w-[4.5rem] h-[4.5rem] bg-white rounded-2xl z-10 flex items-center justify-center overflow-hidden shadow-md ring-1 ring-black/5"
      >
        {logo ? (
          <img src={logo} alt={title} className="w-14 h-14 object-contain" />
        ) : (
          <span className="text-lg font-bold text-primary/40">
            {title.split(" ").map(w => w[0]).join("").slice(0, 2)}
          </span>
        )}
      </motion.div>
      <h4 className="font-bold text-[15px] text-on-surface leading-tight">{title}</h4>
      <p className="text-primary font-medium text-sm">{sub}</p>
      <p className="text-on-surface-variant text-sm mt-0.5">{meta}</p>
    </div>
  )
}

function ExperienceCard({ initials, logo, title, role, period, current, featured }: DeneyimItem) {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,0.06)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className={`bg-white/40 rounded-[1.5rem] border border-outline-variant/10 shadow-sm flex gap-5 transition-colors duration-300 ${featured ? "p-6" : "p-5"}`}
    >
      {/* Logo */}
      <div className={`${featured ? "w-20 h-20" : "w-16 h-16"} rounded-2xl bg-white flex items-center justify-center shrink-0 overflow-hidden shadow-md ring-1 ring-black/5`}>
        {logo ? (
          <img src={logo} alt={title} className={`${featured ? "w-16 h-16" : "w-12 h-12"} object-contain`} />
        ) : (
          <span className={`${featured ? "text-2xl" : "text-lg"} font-bold text-primary`}>{initials}</span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-on-surface">{title}</h4>
          {current ? (
            <motion.span
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="text-xs text-on-surface-variant bg-primary/10 px-2.5 py-1 rounded-full font-medium"
            >
              {period}
            </motion.span>
          ) : (
            <span className="text-xs text-on-surface-variant">{period}</span>
          )}
        </div>
        <p className="text-secondary font-medium text-sm">{role}</p>
      </div>
    </motion.div>
  )
}
