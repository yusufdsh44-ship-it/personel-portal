"use client"

import { useState, useRef, useEffect, useMemo } from "react"

// Türkçe karakterleri normalize et (İ→i, Ş→s, vb.)
function normalize(s: string): string {
  return s
    .toLocaleLowerCase("tr-TR")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
}

interface Props {
  value: string
  onChange: (v: string) => void
  disabled?: boolean
}

export function MudurlukSelect({ value, onChange, disabled }: Props) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")
  const [highlightIdx, setHighlightIdx] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Lazy import — keeps MUDURLUKLER in one place
  const [items, setItems] = useState<string[]>([])
  useEffect(() => {
    import("@/app/lib/test-data").then(m => setItems(m.MUDURLUKLER))
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return items
    const q = normalize(search.trim())
    return items.filter(m => normalize(m).includes(q))
  }, [search, items])

  // Reset highlight when filtered list changes
  useEffect(() => { setHighlightIdx(0) }, [filtered])

  // Scroll highlighted item into view
  useEffect(() => {
    if (!open || !listRef.current) return
    const el = listRef.current.children[highlightIdx] as HTMLElement | undefined
    el?.scrollIntoView({ block: "nearest" })
  }, [highlightIdx, open])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [open])

  const select = (v: string) => {
    onChange(v)
    setSearch("")
    setOpen(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") { setOpen(true); e.preventDefault() }
      return
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setHighlightIdx(i => Math.min(i + 1, filtered.length - 1))
        break
      case "ArrowUp":
        e.preventDefault()
        setHighlightIdx(i => Math.max(i - 1, 0))
        break
      case "Enter":
        e.preventDefault()
        if (filtered[highlightIdx]) select(filtered[highlightIdx])
        break
      case "Escape":
        setOpen(false)
        setSearch("")
        break
    }
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => { setOpen(!open); setTimeout(() => inputRef.current?.focus(), 50) }}
        className={`w-full h-14 px-5 bg-surface-container-highest rounded-xl flex items-center justify-between transition-all outline-none
          ${open ? "ring-2 ring-primary/20" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${value ? "text-on-surface" : "text-on-surface-variant"}`}
      >
        <span className="truncate text-left text-sm">{value || "Müdürlük seçin..."}</span>
        <span className={`material-symbols-outlined text-on-surface-variant text-xl transition-transform ${open ? "rotate-180" : ""}`}>
          expand_more
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 top-[calc(100%+6px)] left-0 right-0 bg-white rounded-2xl shadow-xl shadow-black/10 border border-outline-variant/10 overflow-hidden">
          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-outline-variant/10">
            <span className="material-symbols-outlined text-on-surface-variant text-lg">search</span>
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Müdürlük ara..."
              autoFocus
              className="flex-1 text-sm bg-transparent outline-none placeholder:text-outline-variant/50 text-on-surface"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="text-on-surface-variant/50 hover:text-on-surface-variant">
                <span className="material-symbols-outlined text-base">close</span>
              </button>
            )}
          </div>

          {/* List */}
          <div ref={listRef} className="max-h-64 overflow-y-auto overscroll-contain py-1">
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-sm text-on-surface-variant text-center">Sonuç bulunamadı</p>
            )}
            {filtered.map((m, i) => {
              const isSelected = m === value
              const isHighlighted = i === highlightIdx
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => select(m)}
                  onMouseEnter={() => setHighlightIdx(i)}
                  className={`w-full text-left px-4 py-3 text-sm flex items-center gap-3 transition-colors
                    ${isHighlighted ? "bg-primary-container/30" : ""}
                    ${isSelected ? "text-primary font-semibold" : "text-on-surface"}`}
                >
                  <span className={`material-symbols-outlined text-base ${isSelected ? "text-primary" : "text-transparent"}`}>
                    check
                  </span>
                  <span className="truncate">{m}</span>
                </button>
              )
            })}
          </div>

          {/* Count */}
          <div className="px-4 py-2 border-t border-outline-variant/10 text-[10px] text-on-surface-variant/50">
            {filtered.length} / {items.length} müdürlük
          </div>
        </div>
      )}
    </div>
  )
}
