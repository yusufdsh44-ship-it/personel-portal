"use client"

import { useState } from "react"
import { FadeInView, motion, AnimatePresence } from "../../components/motion"
import { FAQS } from "../data"

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggle = (i: number) => setOpenIndex(prev => prev === i ? null : i)

  return (
    <section className="py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-6 space-y-8">
        <FadeInView>
          <h3 className="text-2xl font-headline font-bold text-on-surface flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">help_outline</span> Sikca Sorulan Sorular
          </h3>
        </FadeInView>

        <div className="space-y-4">
          {FAQS.map((f, i) => (
            <FadeInView key={i} delay={i * 0.08}>
              <div className="glass-card rounded-2xl overflow-hidden transition-colors duration-300">
                <button
                  onClick={() => toggle(i)}
                  className="flex items-center justify-between w-full p-6 text-left"
                >
                  <span className="font-bold text-on-surface pr-4">{f.q}</span>
                  <motion.span
                    animate={{ rotate: openIndex === i ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="material-symbols-outlined text-primary shrink-0"
                  >
                    expand_more
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </FadeInView>
          ))}
        </div>
      </div>
    </section>
  )
}
