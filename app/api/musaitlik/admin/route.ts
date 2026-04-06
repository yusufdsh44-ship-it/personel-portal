import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"

export async function GET(request: NextRequest) {
  const token = request.headers.get("authorization")?.replace("Bearer ", "")
  const expected = process.env.ADMIN_API_TOKEN

  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Yetkisiz erisim." }, { status: 401 })
  }

  const { data: musaitlikRows } = await supabase.from("musaitlik").select("*").order("gun")
  const musaitlik = (musaitlikRows ?? []).map(m => ({
    id: m.id, gun: m.gun, baslangic: m.baslangic, bitis: m.bitis,
    slotDk: m.slot_dk, aktif: m.aktif, kapaliSlotlar: m.kapali_slotlar ?? [],
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

  const doluSlotlar: string[] = []
  for (const t of talepler ?? []) {
    doluSlotlar.push(`${t.istenen_tarih}_${t.istenen_saat}`)
  }

  const { data: kapaliTarihRows } = await supabase
    .from("kapali_tarih_slotlari").select("tarih, saat")
    .gte("tarih", todayStr).lte("tarih", endDateStr)

  for (const k of kapaliTarihRows ?? []) {
    doluSlotlar.push(`${k.tarih}_${k.saat}`)
  }

  return NextResponse.json({ musaitlik, doluSlotlar }, {
    headers: { "Cache-Control": "no-store" },
  })
}
