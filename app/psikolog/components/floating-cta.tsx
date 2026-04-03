"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { motion, AnimatePresence, PulseGlow } from "../../components/motion"

export function FloatingCta() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="fixed bottom-28 right-6 z-40"
        >
          <PulseGlow className="rounded-full">
            <Link
              href="/randevu"
              className="w-14 h-14 rounded-full bg-primary text-on-primary shadow-lg shadow-black/10 flex items-center justify-center hover:opacity-90 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-2xl">calendar_add_on</span>
            </Link>
          </PulseGlow>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
