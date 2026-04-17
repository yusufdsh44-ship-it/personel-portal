import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"
import { isRateLimited, getClientIp } from "@/app/lib/rate-limit"

const NO_STORE = { "Cache-Control": "no-store" } as const
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

function getWeekday(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00")
  if (isNaN(d.getTime())) return -1
  return d.getDay() === 0 ? 7 : d.getDay()
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(`musaitlik:${ip}`, 60, 60_000)) {
    return NextResponse.json({ error: "Cok fazla istek." }, { status: 429, headers: NO_STORE })
  }

  const { data: musaitlikRows } = await supabase.from("musaitlik").select("*").order("gun")
  const musaitlik = (musaitlikRows ?? []).map(m => ({
    gun: m.gun,
    baslangic: m.baslangic,
    bitis: m.bitis,
    slotDk: m.slot_dk,
    aktif: m.aktif,
  }))

  // tarih parametresi yoksa sadece gun konfigurasyonlarini don
  const tarih = request.nextUrl.searchParams.get("tarih")
  if (!tarih) {
    return NextResponse.json({ musaitlik }, { headers: NO_STORE })
  }

  // tarih validasyonu
  if (!DATE_RE.test(tarih)) {
    return NextResponse.json({ error: "Gecersiz tarih formati." }, { status: 400, headers: NO_STORE })
  }

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + 21)
  const maxDateStr = maxDate.toISOString().split("T")[0]

  if (tarih < todayStr || tarih > maxDateStr) {
    return NextResponse.json({ error: "Tarih izin verilen aralik disinda." }, { status: 400, headers: NO_STORE })
  }

  // Gune ait musait slotlari hesapla
  const weekday = getWeekday(tarih)
  const dayConfig = musaitlik.find(m => m.gun === weekday)

  if (!dayConfig?.aktif) {
    return NextResponse.json({ musaitlik, musaitSlotlar: [] }, { headers: NO_STORE })
  }

  // Dolu slotlar — sadece bu tarih icin sorgu
  const { data: talepler } = await supabase
    .from("randevu_talepleri")
    .select("istenen_saat")
    .eq("istenen_tarih", tarih)
    .neq("durum", "Reddedildi")
    .neq("durum", "İptal")

  const dolu = new Set((talepler ?? []).map(t => t.istenen_saat))

  // Haftalik kapali slotlar
  const rawKapali = (musaitlikRows ?? []).find(m => m.gun === weekday)?.kapali_slotlar ?? []
  for (const s of rawKapali) dolu.add(s)

  // Tarihe ozel kapali slotlar
  const { data: kapaliRows } = await supabase
    .from("kapali_tarih_slotlari").select("saat").eq("tarih", tarih)
  for (const k of kapaliRows ?? []) dolu.add(k.saat)

  const [sh, sm] = dayConfig.baslangic.split(":").map(Number)
  const [eh, em] = dayConfig.bitis.split(":").map(Number)
  let t = sh * 60 + sm
  const end = eh * 60 + em
  const musaitSlotlar: string[] = []
  const doluSlotlar: string[] = []

  while (t + dayConfig.slotDk <= end) {
    const slot = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`
    if (dolu.has(slot)) doluSlotlar.push(slot)
    else musaitSlotlar.push(slot)
    t += dayConfig.slotDk
  }

  return NextResponse.json({ musaitlik, musaitSlotlar, doluSlotlar }, { headers: NO_STORE })
}
