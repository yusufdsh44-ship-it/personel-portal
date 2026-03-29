import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"
import { isRateLimited, getClientIp } from "@/app/lib/rate-limit"

// Referans kodu üretici
function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  let code = "KPB-"
  for (let i = 0; i < 8; i++) code += chars[bytes[i] % chars.length]
  return code
}

// Whitelist doğrulama
const VALID_TURLER = ["İlk Görüşme", "Takip", "Acil"]
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/

export async function POST(request: NextRequest) {
  // Rate limit
  const ip = getClientIp(request)
  if (isRateLimited(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen bir dakika bekleyin." }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 })
  }

  // Input doğrulama
  const adSoyad = typeof body.adSoyad === "string" ? body.adSoyad.trim() : ""
  const mudurluk = typeof body.mudurluk === "string" ? body.mudurluk.trim() : ""
  const gorusmeTuru = typeof body.gorusmeTuru === "string" ? body.gorusmeTuru : ""
  const not = typeof body.not === "string" ? body.not.trim().slice(0, 500) : ""
  const istenenTarih = typeof body.istenenTarih === "string" ? body.istenenTarih : ""
  const istenenSaat = typeof body.istenenSaat === "string" ? body.istenenSaat : ""
  const kseDurumu = typeof body.kseDurumu === "string" ? body.kseDurumu.slice(0, 20) : ""
  const bfiDurumu = typeof body.bfiDurumu === "string" ? body.bfiDurumu.slice(0, 20) : ""

  if (!adSoyad || adSoyad.length < 3 || adSoyad.length > 100) {
    return NextResponse.json({ error: "Geçerli bir ad soyad giriniz." }, { status: 400 })
  }
  if (!mudurluk || mudurluk.length > 100) {
    return NextResponse.json({ error: "Geçerli bir müdürlük seçiniz." }, { status: 400 })
  }
  if (!VALID_TURLER.includes(gorusmeTuru)) {
    return NextResponse.json({ error: "Geçerli bir görüşme türü seçiniz." }, { status: 400 })
  }
  if (!DATE_REGEX.test(istenenTarih)) {
    return NextResponse.json({ error: "Geçerli bir tarih seçiniz." }, { status: 400 })
  }
  if (!TIME_REGEX.test(istenenSaat)) {
    return NextResponse.json({ error: "Geçerli bir saat seçiniz." }, { status: 400 })
  }

  // Geçmiş tarih kontrolü
  const today = new Date().toISOString().split("T")[0]
  if (istenenTarih < today) {
    return NextResponse.json({ error: "Geçmiş tarihe randevu oluşturulamaz." }, { status: 400 })
  }

  // Aynı slot'un dolu olup olmadığını kontrol et (race condition önlemi)
  const { data: existing } = await supabase
    .from("randevu_talepleri")
    .select("id")
    .eq("istenen_tarih", istenenTarih)
    .eq("istenen_saat", istenenSaat)
    .neq("durum", "Reddedildi")
    .neq("durum", "İptal")
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ error: "Bu saat dolu. Lütfen başka bir saat seçiniz." }, { status: 409 })
  }

  const refCode = generateRefCode()

  const { error } = await supabase.from("randevu_talepleri").insert({
    id: crypto.randomUUID(),
    ad_soyad: adSoyad,
    mudurluk,
    gorusme_turu: gorusmeTuru,
    not_text: not,
    istenen_tarih: istenenTarih,
    istenen_saat: istenenSaat,
    durum: "Bekliyor",
    kaynak: "online",
    referans_kodu: refCode,
    kse_durumu: kseDurumu,
    bfi_durumu: bfiDurumu,
  })

  if (error) {
    // Unique constraint violation = aynı slot'a eşzamanlı booking
    if (error.code === "23505") {
      return NextResponse.json({ error: "Bu saat az önce doldu. Lütfen başka bir saat seçiniz." }, { status: 409 })
    }
    console.error("[randevu] Supabase insert error:", error)
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 })
  }

  return NextResponse.json({ success: true, referansKodu: refCode }, { status: 201 })
}
