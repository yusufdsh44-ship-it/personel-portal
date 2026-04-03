"use client"

import { motion, AnimatePresence, useReducedMotion, useScroll, useTransform, useSpring, type Variants } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef, useState, useEffect, type ReactNode } from "react"

// Fade in from bottom (respects prefers-reduced-motion)
export function FadeIn({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string
}) {
  const reduced = useReducedMotion()
  return (
    <motion.div
      initial={reduced ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduced ? 0 : 0.5, delay: reduced ? 0 : delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Fade in when scrolled into view
export function FadeInView({ children, delay = 0, className = "" }: {
  children: ReactNode; delay?: number; className?: string
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Stagger children
const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}

const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
}

export function StaggerContainer({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={staggerItem} className={className}>
      {children}
    </motion.div>
  )
}

// Scale on tap (for buttons/cards)
export function TapScale({ children, className = "", scale = 0.97 }: {
  children: ReactNode; className?: string; scale?: number
}) {
  return (
    <motion.div whileTap={{ scale }} className={className}>
      {children}
    </motion.div>
  )
}

// Slide transition for page-like content
export function SlideIn({ children, direction = "right", className = "" }: {
  children: ReactNode; direction?: "left" | "right"; className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: direction === "right" ? 40 : -40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction === "right" ? -40 : 40 }}
      transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Success checkmark animation
export function SuccessCheck() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
      className="w-24 h-24 rounded-full bg-primary-container flex items-center justify-center mx-auto"
    >
      <motion.span
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.3 }}
        className="material-symbols-outlined text-primary text-5xl"
      >
        check_circle
      </motion.span>
    </motion.div>
  )
}

// Pulse glow for CTA
export function PulseGlow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      animate={{ boxShadow: ["0 0 0 0 rgba(181,105,77,0)", "0 0 0 8px rgba(181,105,77,0.1)", "0 0 0 0 rgba(181,105,77,0)"] }}
      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      className={`rounded-2xl ${className}`}
    >
      {children}
    </motion.div>
  )
}

// Animated count-up number (triggers when scrolled into view)
export function CountUp({ target, suffix = "", prefix = "", duration = 1.5 }: {
  target: number; suffix?: string; prefix?: string; duration?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-40px" })
  const reduced = useReducedMotion()
  const resolvedInitial = reduced ? target : 0
  const [display, setDisplay] = useState(resolvedInitial)

  useEffect(() => {
    if (!isInView) return
    if (reduced) return
    let start = 0
    const startTime = performance.now()
    const step = (now: number) => {
      const elapsed = Math.min((now - startTime) / (duration * 1000), 1)
      // ease-out cubic
      const progress = 1 - Math.pow(1 - elapsed, 3)
      const current = Math.round(progress * target)
      if (current !== start) {
        start = current
        setDisplay(current)
      }
      if (elapsed < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, target, duration, reduced])

  return <span ref={ref}>{prefix}{display.toLocaleString("tr-TR")}{suffix}</span>
}

// Stagger children — triggers on scroll into view (not on mount)
export function StaggerInView({ children, className = "", stagger = 0.08 }: {
  children: ReactNode; className?: string; stagger?: number
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-60px" })

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: 0.1 } } }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export { motion, AnimatePresence, useScroll, useTransform, useSpring }
