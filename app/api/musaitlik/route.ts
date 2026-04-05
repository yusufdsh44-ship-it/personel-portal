import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"
import { isRateLimited, getClientIp } from "@/app/lib/rate-limit"

function getWeekday(dateStr: string): number {
  const d = new Date(dateStr + "T12:00:00")
  if (isNaN(d.getTime())) return -1
  return d.getDay() === 0 ? 7 : d.getDay()
}

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip, 20, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 })
  }

  const { data: musaitlikRows } = await supabase.from("musaitlik").select("*").order("gun")
  const musaitlik = (musaitlikRows ?? []).map(m => ({
    id: m.id,
    gun: m.gun,
    baslangic: m.baslangic,
    bitis: m.bitis,
    slotDk: m.slot_dk,
    aktif: m.aktif,
    kapaliSlotlar: m.kapali_slotlar ?? [],
  }))

  const today = new Date()
  const todayStr = today.toISOString().split("T")[0]
  const endDate = new Date(today)
  endDate.setDate(endDate.getDate() + 21)
  const endDateStr = endDate.toISOString().split("T")[0]

  const { data: talepler } = await supabase
    .from("randevu_talepleri")
    .select("istenen_tarih, istenen_saat, durum")
    .gte("istenen_tarih", todayStr)
    .lte("istenen_tarih", endDateStr)
    .neq("durum", "Reddedildi")
    .neq("durum", "İptal")

  const doluSlotlar = new Set<string>()
  for (const t of talepler ?? []) {
    doluSlotlar.add(`${t.istenen_tarih}_${t.istenen_saat}`)
  }

  // Haftalik kapali slotlar (genel)
  for (let i = 0; i <= 21; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().split("T")[0]
    const weekday = getWeekday(dateStr)
    if (weekday === -1) continue
    const dayConfig = musaitlik.find(m => m.gun === weekday)
    if (dayConfig?.aktif && dayConfig.kapaliSlotlar?.length) {
      for (const slot of dayConfig.kapaliSlotlar) {
        doluSlotlar.add(`${dateStr}_${slot}`)
      }
    }
  }

  // Tarihe ozel kapali slotlar
  const { data: kapaliTarihRows } = await supabase.from("kapali_tarih_slotlari").select("tarih, saat").gte("tarih", todayStr).lte("tarih", endDateStr)
  for (const k of kapaliTarihRows ?? []) {
    doluSlotlar.add(`${k.tarih}_${k.saat}`)
  }

  return NextResponse.json({
    musaitlik,
    doluSlotlar: Array.from(doluSlotlar),
  })
}
