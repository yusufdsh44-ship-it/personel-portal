import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET() {
  const { data, error } = await supabase
    .from("kesfet_paylasimlar")
    .select("*")
    .eq("onaylandi", true)
    .order("olusturma_tarihi", { ascending: false })
    .limit(50)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 })
  }

  const alinti = typeof body.alinti === "string" ? body.alinti.trim() : ""
  const kitapAdi = typeof body.kitapAdi === "string" ? body.kitapAdi.trim() : ""
  const yazar = typeof body.yazar === "string" ? body.yazar.trim() : ""

  if (!alinti || alinti.length < 10) return NextResponse.json({ error: "Alıntı en az 10 karakter olmalı." }, { status: 400 })
  if (!kitapAdi) return NextResponse.json({ error: "Kitap adı gerekli." }, { status: 400 })
  if (!yazar) return NextResponse.json({ error: "Yazar adı gerekli." }, { status: 400 })

  const anonim = body.anonim === true

  const { error } = await supabase.from("kesfet_paylasimlar").insert({
    ad_soyad: anonim ? null : (typeof body.adSoyad === "string" ? body.adSoyad.trim() : null),
    mudurluk: anonim ? null : (typeof body.mudurluk === "string" ? body.mudurluk.trim() : null),
    anonim,
    kitap_adi: kitapAdi,
    yazar,
    alinti,
    yorum: typeof body.yorum === "string" ? body.yorum.trim() || null : null,
    onaylandi: false,
  })

  if (error) return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
