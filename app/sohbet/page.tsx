"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import Script from "next/script"
import Markdown from "react-markdown"
import { Header } from "../components/header"
import { motion } from "../components/motion"

declare global {
  interface Window {
    turnstile?: {
      render: (container: string | HTMLElement, opts: Record<string, unknown>) => string
      reset: (widgetId: string) => void
      remove: (widgetId: string) => void
    }
  }
}

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""

interface Message {
  role: "user" | "assistant"
  content: string
  isError?: boolean
}


const WORKFLOWS = [
  {
    icon: "calendar_month",
    label: "Randevu Yönetimi",
    desc: "Randevu al, sorgula, iptal et veya değiştir",
    example: "Randevu almak istiyorum",
    accent: "bg-primary/8 text-primary",
  },
  {
    icon: "description",
    label: "Görüşme Özeti",
    desc: "Görüşme özetimi PDF olarak istiyorum",
    example: "Görüşme özetimi PDF olarak istiyorum",
    accent: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: "mail",
    label: "Mesaj Gönder",
    desc: "Psikoloğa anonim veya isimli mesaj ilet",
    example: "Psikoloğa mesaj göndermek istiyorum",
    accent: "bg-rose-50 text-rose-700",
  },
  {
    icon: "assignment",
    label: "Test Durumu",
    desc: "Ref kodunla testlerini kontrol et",
    example: "Testlerimi tamamladım mı?",
    accent: "bg-purple-50 text-purple-700",
  },
]


const ANIMATED_HINTS = [
  "Randevu almak istiyorum",
  "Seans raporumu görmek istiyorum",
  "Psikoloğa mesaj göndermek istiyorum",
  "Testlerimi tamamladım mı?",
  "Görüşme sonrası ne olacak?",
  "Süreç nasıl işliyor?",
]

export default function SohbetPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState<number | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const isEmpty = messages.length === 0

  // Turnstile CAPTCHA (invisible mode)
  const turnstileTokenRef = useRef("")
  const turnstileWidgetRef = useRef("")
  const turnstileContainerRef = useRef<HTMLDivElement>(null)

  const initTurnstile = useCallback(() => {
    if (!TURNSTILE_SITE_KEY || !window.turnstile || !turnstileContainerRef.current) return
    if (turnstileWidgetRef.current) return // already initialized
    turnstileWidgetRef.current = window.turnstile.render(turnstileContainerRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      size: "invisible",
      callback: (token: string) => { turnstileTokenRef.current = token },
    })
  }, [])

  useEffect(() => {
    if (TURNSTILE_SITE_KEY && window.turnstile) initTurnstile()
  }, [initTurnstile])

  const [hintIdx, setHintIdx] = useState(0)
  const [hintText, setHintText] = useState("")
  const showAnimatedHint = isEmpty && !input && !loading

  useEffect(() => {
    if (!showAnimatedHint) return
    const full = ANIMATED_HINTS[hintIdx]
    let i = 0
    let erasing = false
    let timer: ReturnType<typeof setTimeout>
    const tick = () => {
      if (!erasing) {
        if (i <= full.length) {
          setHintText(full.slice(0, i))
          i++
          timer = setTimeout(tick, 45 + Math.random() * 35)
        } else {
          timer = setTimeout(() => { erasing = true; tick() }, 2200)
        }
      } else {
        if (i > 0) {
          i--
          setHintText(full.slice(0, i))
          timer = setTimeout(tick, 25)
        } else {
          setHintIdx(prev => (prev + 1) % ANIMATED_HINTS.length)
        }
      }
    }
    timer = setTimeout(tick, 600)
    return () => clearTimeout(timer)
  }, [hintIdx, showAnimatedHint])

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight })
  }, [messages, loading])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = "0"
    ta.style.height = Math.min(ta.scrollHeight, 160) + "px"
  }, [input])

  const clearChat = () => {
    setMessages([])
  }

  const copyMessage = (idx: number, text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 1500)
  }

  const send = useCallback(async (text: string) => {
    if (!text.trim() || loading) return

    const userMsg: Message = { role: "user", content: text.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput("")
    setLoading(true)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 90000)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          ...(turnstileTokenRef.current ? { turnstileToken: turnstileTokenRef.current } : {}),
        }),
        signal: controller.signal,
      })
      if (!res.ok) {
        setMessages(prev => [...prev, {
          role: "assistant",
          content: "Şu an yanıt veremiyorum. Lütfen biraz sonra tekrar deneyin.",
          isError: true,
        }])
        return
      }
      const data = await res.json()
      if (data.error) {
        setMessages(prev => [...prev, { role: "assistant", content: "Şu an yanıt veremiyorum. Lütfen tekrar deneyin.", isError: true }])
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: data.message || "Şu an yanıt veremiyorum." }])
      }
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === "AbortError"
      setMessages(prev => [...prev, {
        role: "assistant",
        content: isTimeout ? "Yanıt biraz uzun sürdü, lütfen tekrar deneyin." : "Bağlantı sorunu yaşandı. Lütfen tekrar deneyin.",
        isError: true,
      }])
    } finally {
      clearTimeout(timeoutId)
      setLoading(false)
      // Reset Turnstile for next request
      if (turnstileWidgetRef.current && window.turnstile) {
        window.turnstile.reset(turnstileWidgetRef.current)
      }
      setTimeout(() => textareaRef.current?.focus(), 100)
    }
  }, [messages, loading])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      // Hint aktifse ve input boşsa → hint metnini gönder
      if (!input.trim() && showAnimatedHint && hintText.length === ANIMATED_HINTS[hintIdx].length) {
        send(ANIMATED_HINTS[hintIdx])
      } else {
        send(input)
      }
    }
  }

  return (
    <>
      <Header />
      {/* Turnstile invisible widget */}
      <div ref={turnstileContainerRef} className="hidden" />
      {TURNSTILE_SITE_KEY && (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          onReady={initTurnstile}
        />
      )}
      <div className="fixed inset-0 flex flex-col pt-16 pb-24 z-10 bg-surface">
        {/* Messages area */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-4 py-6">
            {/* Empty state — viewport'a sigacak, scroll yok */}
            {isEmpty && (
              <div className="flex flex-col items-center justify-center h-full">
                {/* Header */}
                <div className="text-center pb-4">
                  <div className="inline-flex items-center gap-2 mb-2">
                    <span className="material-symbols-outlined text-primary/40 text-lg">smart_toy</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl text-primary tracking-tight" style={{ fontFamily: "var(--font-caveat), cursive" }}>
                    Dijital İkizim
                  </h1>
                  <p className="text-on-surface-variant/40 text-[11px] mt-1">Size nasıl yardımcı olabilirim?</p>
                </div>

                {/* Workflow cards — kompakt 2x2 grid */}
                <div className="w-full max-w-lg flex-1 flex flex-col justify-center">
                  <div className="grid grid-cols-2 gap-2.5">
                    {WORKFLOWS.slice(0, 4).map(w => (
                      <motion.button key={w.label} onClick={() => send(w.example)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        className="text-left p-3.5 rounded-2xl border border-outline-variant/10 bg-surface-container-low/30 hover:bg-surface-container-high/50 hover:border-outline-variant/20 transition-all"
                      >
                        <div className="flex items-center gap-2.5 mb-1.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${w.accent}`}>
                            <span className="material-symbols-outlined text-base">{w.icon}</span>
                          </div>
                          <span className="text-[13px] font-bold text-on-surface">{w.label}</span>
                        </div>
                        <p className="text-[11px] text-on-surface-variant/50 leading-relaxed">{w.desc}</p>
                      </motion.button>
                    ))}
                  </div>

                </div>

              </div>
            )}

            {/* Messages */}
            {!isEmpty && (
              <div className="space-y-6">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    {msg.role === "assistant" && (
                      <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary">YP</span>
                      </div>
                    )}
                    <div className={`max-w-[80%] group relative ${
                      msg.role === "user"
                        ? "bg-primary/10 text-on-surface rounded-3xl rounded-br-lg px-4 py-3"
                        : msg.isError
                          ? "bg-red-50 text-red-700 border border-red-200 rounded-2xl px-4 py-3"
                          : "text-on-surface"
                    }`}>
                      {msg.role === "user" ? (
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      ) : msg.isError ? (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="material-symbols-outlined text-red-500 text-base">error</span>
                          <span>{msg.content}</span>
                        </div>
                      ) : (
                        <div className="text-sm leading-relaxed prose prose-sm prose-neutral max-w-none
                          prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5
                          prose-strong:text-on-surface prose-strong:font-bold
                          prose-headings:font-headline prose-headings:text-on-surface">
                          <Markdown>{msg.content}</Markdown>
                        </div>
                      )}

                      {/* Copy button */}
                      {msg.role === "assistant" && !msg.isError && (
                        <button
                          onClick={() => copyMessage(i, msg.content)}
                          className="absolute -bottom-5 left-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] text-on-surface-variant/60 hover:text-on-surface-variant"
                        >
                          <span className="material-symbols-outlined text-xs">
                            {copied === i ? "check" : "content_copy"}
                          </span>
                          {copied === i ? "Kopyalandı" : "Kopyala"}
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {loading && (
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-primary text-sm">psychology</span>
                    </div>
                    <div className="flex items-center gap-2 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-on-surface-variant/30 animate-bounce" style={{ animationDelay: "0ms" }} />
                        <div className="w-2 h-2 rounded-full bg-on-surface-variant/30 animate-bounce" style={{ animationDelay: "150ms" }} />
                        <div className="w-2 h-2 rounded-full bg-on-surface-variant/30 animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span className="text-xs text-on-surface-variant/50">düşünüyor...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Input bar — pinned bottom */}
        <div className="shrink-0 px-4 pb-2 pt-2 bg-surface">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <motion.div
              className={`relative flex items-end bg-surface-container-high/40 rounded-3xl border transition-colors ${
                showAnimatedHint
                  ? "border-primary/20"
                  : "border-outline-variant/20 focus-within:border-primary/30"
              }`}
              animate={showAnimatedHint ? {
                boxShadow: [
                  "0 0 0 0 rgba(41,104,104,0)",
                  "0 0 12px 2px rgba(41,104,104,0.08)",
                  "0 0 0 0 rgba(41,104,104,0)",
                ],
              } : { boxShadow: "0 0 0 0 rgba(41,104,104,0)" }}
              transition={showAnimatedHint ? { duration: 4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.3 }}
            >
              {/* Animated typing placeholder — tıklanabilir */}
              {showAnimatedHint && (
                <button
                  type="button"
                  onClick={() => {
                    const full = ANIMATED_HINTS[hintIdx]
                    setInput(full)
                    setHintText("")
                    setTimeout(() => textareaRef.current?.focus(), 50)
                  }}
                  className="absolute left-5 right-14 top-1/2 -translate-y-1/2 text-sm text-primary/70 font-medium flex items-center justify-between cursor-pointer hover:text-primary transition-colors"
                >
                  <span className="flex items-center">
                    <span>{hintText}</span>
                    <motion.span
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.53, repeat: Infinity, repeatType: "reverse" }}
                      className="inline-block w-[2px] h-[18px] bg-primary/70 ml-px rounded-full"
                    />
                  </span>
                  {hintText.length === ANIMATED_HINTS[hintIdx].length && (
                    <motion.span
                      initial={{ opacity: 0, x: -5 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-primary/40 font-mono tracking-wider flex items-center gap-1 shrink-0"
                    >
                      gönder
                    </motion.span>
                  )}
                </button>
              )}
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={showAnimatedHint ? "" : (isEmpty ? "Size nasıl yardımcı olabilirim?" : "Cevabınızı yazın...")}
                disabled={loading}
                rows={1}
                className="flex-1 bg-transparent resize-none px-5 py-3.5 text-sm text-on-surface placeholder:text-outline/40 outline-none max-h-40 disabled:opacity-50"
              />
              {!isEmpty && (
                <button
                  type="button"
                  onClick={clearChat}
                  title="Konuşmayı temizle"
                  className="w-9 h-9 m-2 rounded-full text-on-surface-variant/40 flex items-center justify-center hover:text-on-surface-variant hover:bg-surface-container-high/60 active:scale-95 transition-all shrink-0"
                >
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  if (input.trim()) { send(input) }
                  else if (showAnimatedHint && hintText.length === ANIMATED_HINTS[hintIdx].length) { send(ANIMATED_HINTS[hintIdx]) }
                }}
                disabled={(!input.trim() && !(showAnimatedHint && hintText.length === ANIMATED_HINTS[hintIdx].length)) || loading}
                className="w-9 h-9 m-2 rounded-full bg-primary text-on-primary flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-20 shrink-0"
              >
                <span className="material-symbols-outlined text-lg">arrow_upward</span>
              </button>
            </motion.div>
            <p className="text-center text-[10px] text-on-surface-variant/40 mt-1">
              Dijital ikiz hatalar yapabilir. · powered by <span className="font-semibold">Yusuf Pamuk</span>
            </p>
          </form>
        </div>
      </div>
    </>
  )
}
