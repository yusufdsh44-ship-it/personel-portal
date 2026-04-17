import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"
import { isRateLimited, getClientIp } from "@/app/lib/rate-limit"

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(`mesaj:${ip}`, 5, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen bir dakika bekleyin." }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 })
  }

  const mesaj = typeof body.mesaj === "string" ? body.mesaj.trim() : ""
  if (!mesaj || mesaj.length < 5 || mesaj.length > 5000) {
    return NextResponse.json({ error: "Mesaj 5-5000 karakter arası olmalıdır." }, { status: 400 })
  }

  const kategori = typeof body.kategori === "string" ? body.kategori.trim() : ""
  if (!kategori) {
    return NextResponse.json({ error: "Kategori seçilmelidir." }, { status: 400 })
  }

  const anonim = body.anonim === true
  if (!anonim && !body.adSoyad) {
    return NextResponse.json({ error: "Ad soyad gereklidir." }, { status: 400 })
  }

  const email = !anonim && typeof body.email === "string" ? body.email.trim() : null
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Geçerli bir e-posta adresi giriniz." }, { status: 400 })
  }

  const { error } = await supabase.from("mesajlar").insert({
    anonim,
    ad_soyad: anonim ? null : String(body.adSoyad).trim().slice(0, 100),
    mudurluk: anonim ? null : body.mudurluk ? String(body.mudurluk).trim().slice(0, 100) : null,
    email,
    kategori,
    mesaj,
  })

  if (error) {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
