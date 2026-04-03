"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"

const TABS = [
  { href: "/", label: "Psikolog", icon: "badge" },
  { href: "/randevu", label: "Randevu", icon: "event_available" },
  { href: "/sohbet", label: "Chat", icon: "smart_toy" },
  { href: "/testler", label: "Testler", icon: "assignment" },
  { href: "/mesaj", label: "Mesaj", icon: "mail" },
]

export function BottomNav() {
  const path = usePathname()

  return (
    <nav aria-label="Ana navigasyon" className="fixed bottom-0 left-0 right-0 w-full z-50 nav-glass border-t border-outline-variant/20 rounded-t-[2rem]">
      <div className="flex justify-around items-center px-2 pt-3 pb-7 max-w-lg mx-auto">
        {TABS.map(({ href, label, icon }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href)
          return (
            <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center justify-center gap-1 px-3 sm:px-5 py-2 min-w-0">
              {active && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute inset-0 bg-primary-container rounded-full"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <motion.span
                whileTap={{ scale: 0.85 }}
                className={`material-symbols-outlined text-2xl relative z-10 ${active ? "filled text-primary-dim" : "text-on-surface-variant"}`}
              >
                {icon}
              </motion.span>
              <span className={`text-xs font-semibold tracking-wide relative z-10 ${active ? "text-primary-dim" : "text-on-surface-variant"}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
