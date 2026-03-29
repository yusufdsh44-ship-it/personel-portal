import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/app/lib/supabase"
import { createHash } from "crypto"

export async function POST(request: NextRequest) {
  let body: { paylasimId?: string }
  try { body = await request.json() } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 })
  }

  if (!body.paylasimId) return NextResponse.json({ error: "Paylaşım ID gerekli." }, { status: 400 })

  // IP hash oluştur (gizlilik için hash'leniyor)
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || "unknown"
  const ipHash = createHash("sha256").update(ip + body.paylasimId).digest("hex").slice(0, 16)

  // Tekrar like engeli (unique constraint)
  const { error: likeError } = await supabase.from("kesfet_likeler").insert({
    paylasim_id: body.paylasimId,
    ip_hash: ipHash,
  })

  if (likeError) {
    if (likeError.code === "23505") { // unique violation
      return NextResponse.json({ error: "Zaten beğendiniz.", already: true }, { status: 409 })
    }
    return NextResponse.json({ error: "Bir hata oluştu." }, { status: 500 })
  }

  // like_sayisi increment via RPC
  const rpcResult = await supabase.rpc("increment_like", { row_id: body.paylasimId })
  if (rpcResult.error) {
    // Fallback: manual update
    const { data: row } = await supabase.from("kesfet_paylasimlar").select("like_sayisi").eq("id", body.paylasimId).single()
    if (row) {
      await supabase.from("kesfet_paylasimlar").update({ like_sayisi: (row.like_sayisi ?? 0) + 1 }).eq("id", body.paylasimId)
    }
  }

  return NextResponse.json({ success: true })
}
