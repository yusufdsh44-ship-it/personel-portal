"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const TABS = [
  { href: "/", label: "Psikolog", icon: "badge", color: "text-[#8B5E3C]", bg: "bg-[#8B5E3C]/10" },
  { href: "/randevu", label: "Randevu", icon: "event_available", color: "text-[#2a6070]", bg: "bg-[#2a6070]/10" },
  { href: "/sohbet", label: "Chat", icon: "smart_toy", color: "text-[#1e5570]", bg: "bg-[#1e5570]/10" },
  { href: "/testler", label: "Testler", icon: "assignment", color: "text-[#6b3f7a]", bg: "bg-[#6b3f7a]/10" },
  { href: "/mesaj", label: "Mesaj", icon: "mail", color: "text-[#b5694d]", bg: "bg-[#b5694d]/10" },
]

export function BottomNav() {
  const path = usePathname()

  return (
    <nav aria-label="Ana navigasyon" className="fixed bottom-0 left-0 right-0 w-full z-50 nav-glass border-t border-outline-variant/20 rounded-t-[2rem]">
      <div className="flex justify-around items-center px-2 pt-3 pb-4 max-w-lg mx-auto">
        {TABS.map(({ href, label, icon, color, bg }) => {
          const active = href === "/" ? path === "/" : path.startsWith(href)
          return (
            <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined}
              className="relative flex flex-col items-center justify-center gap-1 px-3 sm:px-5 py-2 min-w-0">
              {active && (
                <div className={`absolute inset-0 ${bg} rounded-full transition-all duration-300`} />
              )}
              <span
                key={`${icon}-${active}`}
                className={`material-symbols-outlined text-2xl relative z-10 transition-colors duration-200 inline-block ${color} ${active ? `filled nav-anim-${icon}` : ""}`}
              >
                {icon}
              </span>
              <span className={`text-xs font-semibold tracking-wide relative z-10 transition-colors duration-200 ${active ? color : "text-on-surface-variant"}`}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
