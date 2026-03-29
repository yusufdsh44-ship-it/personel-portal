import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"
import { Resend } from "resend"
import { isRateLimited, getClientIp } from "@/app/lib/rate-limit"

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL || ""

const VALID_TESTS = ["KSE-53", "BFI-2"]

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip, 3, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen bir dakika bekleyin." }, { status: 429 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 })
  }

  const adSoyad = typeof body.adSoyad === "string" ? body.adSoyad.trim() : ""
  const mudurluk = typeof body.mudurluk === "string" ? body.mudurluk.trim() : ""
  const testTuru = typeof body.testTuru === "string" ? body.testTuru : ""
  const tarih = typeof body.tarih === "string" ? body.tarih : ""

  if (!adSoyad || adSoyad.length < 3) {
    return NextResponse.json({ error: "Geçerli bir ad soyad giriniz." }, { status: 400 })
  }
  if (!mudurluk) {
    return NextResponse.json({ error: "Müdürlük seçilmelidir." }, { status: 400 })
  }
  if (!VALID_TESTS.includes(testTuru)) {
    return NextResponse.json({ error: "Geçersiz test türü." }, { status: 400 })
  }
  if (!Array.isArray(body.cevaplar) || body.cevaplar.length === 0) {
    return NextResponse.json({ error: "Cevaplar gereklidir." }, { status: 400 })
  }

  // Cevap sayısı ve değer aralığı kontrolü
  const expectedLength = testTuru === "KSE-53" ? 53 : testTuru === "BFI-2" ? 60 : 0
  if (body.cevaplar.length !== expectedLength) {
    return NextResponse.json({ error: `${testTuru} için ${expectedLength} cevap bekleniyor.` }, { status: 400 })
  }
  const minVal = testTuru === "KSE-53" ? 0 : 1
  const maxVal = testTuru === "KSE-53" ? 4 : 5
  if (!body.cevaplar.every((c: unknown) => typeof c === "number" && Number.isInteger(c) && c >= minVal && c <= maxVal)) {
    return NextResponse.json({ error: "Geçersiz cevap değeri." }, { status: 400 })
  }

  const { error } = await supabase.from("test_sonuclari").insert({
    ad_soyad: adSoyad,
    mudurluk,
    test_turu: testTuru,
    cevaplar: body.cevaplar,
    tarih: new Date().toISOString(), // Server timestamp — client tarihine güvenme
    kaynak: "online",
  })

  if (error) {
    console.error("[test-sonuc] Supabase insert error:", error)
    return NextResponse.json({ error: "Bir hata oluştu. Lütfen tekrar deneyin." }, { status: 500 })
  }

  // E-posta bildirimi (Resend yapılandırılmışsa)
  if (resend && NOTIFY_EMAIL) {
    const tarihStr = new Date(tarih || Date.now()).toLocaleString("tr-TR", {
      day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
    })

    try {
      await resend.emails.send({
        from: "Sakin Sığınak <onboarding@resend.dev>",
        to: NOTIFY_EMAIL,
        subject: `Yeni ${testTuru} Sonucu — ${adSoyad}`,
        html: `
          <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px">
            <h2 style="color:#296868;margin:0 0 16px">Yeni Test Sonucu</h2>
            <table style="width:100%;border-collapse:collapse;font-size:14px">
              <tr><td style="padding:8px 0;color:#666;width:100px">Ad Soyad</td><td style="padding:8px 0;font-weight:600">${adSoyad}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Müdürlük</td><td style="padding:8px 0">${mudurluk}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Test</td><td style="padding:8px 0;font-weight:600;color:#296868">${testTuru}</td></tr>
              <tr><td style="padding:8px 0;color:#666">Tarih</td><td style="padding:8px 0">${tarihStr}</td></tr>
            </table>
            <p style="color:#999;font-size:12px;margin-top:24px;border-top:1px solid #eee;padding-top:12px">
              Bu bildirim Sakin Sığınak personel portalı tarafından otomatik gönderilmiştir.
            </p>
          </div>
        `,
      })
    } catch {
      // E-posta gönderilemezse test kaydı yine de başarılı sayılır
      console.error("E-posta bildirimi gönderilemedi")
    }
  }

  return NextResponse.json({ success: true }, { status: 201 })
}
