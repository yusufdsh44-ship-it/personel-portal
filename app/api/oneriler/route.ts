import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"
import { isRateLimited, getClientIp } from "@/app/lib/rate-limit"

export async function GET(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip, 10, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek." }, { status: 429 })
  }

  const ref = request.nextUrl.searchParams.get("ref")?.trim().toUpperCase()

  if (!ref || !/^KPB-[A-Z0-9]{8}$/.test(ref)) {
    return NextResponse.json({ error: "Geçersiz referans kodu." }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("danisan_onerileri")
    .select("id, tur, baslik, aciklama, url, yazar, alinti, olusturma_tarihi")
    .eq("referans_kodu", ref)
    .eq("gorunur", true)
    .order("olusturma_tarihi", { ascending: false })

  if (error) {
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
  }

  return NextResponse.json(data ?? [])
}
