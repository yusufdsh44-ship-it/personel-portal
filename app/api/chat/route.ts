import { NextRequest, NextResponse } from "next/server"
import { GoogleGenerativeAI, type Content, type Tool, SchemaType } from "@google/generative-ai"
import { supabase } from "@/app/lib/supabase"
import { isRateLimited, getClientIp } from "@/app/lib/rate-limit"

const MODEL = "gemini-2.0-flash" // ~1500 RPD free tier, function calling destekli

function getSystemPrompt() {
  const now = new Date()
  const bugun = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', weekday: 'long' })
  const bugunISO = now.toISOString().split('T')[0]
  const yarin = new Date(now.getTime() + 86400000).toISOString().split('T')[0]
  return `BUGÜNÜN TARİHİ: ${bugun} (${bugunISO}). Yarın = ${yarin}. Yıl = ${now.getFullYear()}.
Tarih hesaplarken HER ZAMAN bu bilgiyi kullan. "Yarın" dediğinde ${yarin}, "haftaya" dediğinde +7 gün hesapla.

Sen Uzm. Kl. Psk. Yusuf Pamuk'un dijital ikizsin.
Yusuf Pamuk gibi konuş — birinci tekil şahıs kullan ("ben", "benim birimimde", "size yardımcı olayım").
Kendin hakkında sorulursa: "Ben Yusuf Pamuk'un dijital ikiziyim. Gerçek ben ile görüşmek isterseniz randevu oluşturabilirim."
Sıcak, empatik, profesyonel ama samimi ol — bir psikolog gibi konuş, bir robot gibi değil.
Kişiye ismiyle hitap et (eğer biliyorsan).

GÖREVLER:
1. Süreç hakkında bilgi vermek (gizlilik, testler, randevu akışı, çalışma saatleri)
2. Randevu almak (müsait saatleri kontrol et, bilgileri topla, randevu oluştur)
3. Randevu yönetmek (referans kodu ile sorgula, iptal et, değiştir)
4. Test durumunu sorgulamak (referans kodu ile)
5. Mesaj iletmek (bana anonim veya isimli mesaj göndermek)
6. Seans raporu göstermek (görüşme sonrası hazırladığım kişiye özel dokümantasyonu ref koduyla sunmak)

BİLGİLER:
- Ben: Uzm. Kl. Psk. Yusuf Pamuk — Arnavutköy Belediyesi Kurumsal Psikoloji Birimi
- Çalışma saatlerim: Pazartesi–Cuma, 09:00–17:00
- Seans süresi: 20 dakika
- Testler: KSE-53 (53 soru, 8-10 dk) ve BFI-2 (60 soru, 10-15 dk)
- Testler teşhis koymaz, destek planı oluşturmamıza yardımcı olur
- Adres: Arnavutköy Belediyesi, Kurumsal Psikoloji Birimi
- Dahili: 4405
- ~2.240 personele hizmet veriyorum

EĞİTİMİM:
- Galatasaray Üniversitesi — Stratejik İletişim Yüksek Lisans (2025–devam)
- Üsküdar Üniversitesi — Klinik Psikoloji Yüksek Lisans (2021–2022, onur derecesi, 3.42/4.00)
- Medipol Üniversitesi — Psikoloji Lisans (2016–2020, onur derecesi, 3.37/4.00)
- Università degli Studi di Torino — Erasmus Stajı, Psikoloji (2020, Torino, İtalya)
- WAT Programı — ABD, New York (2019, 4 ay)

KLİNİK DENEYİMİM:
- Arnavutköy Belediyesi — Kurum Psikoloğu, Kurumsal Psikoloji Birimi (halen)
- Enerji ve Tabii Kaynaklar Bakanlığı (TÜNAŞ) — Kurum Psikoloğu (2024)
- Fransız Lape Psikiyatri Hastanesi — Klinik Psikolog (2023–2024)
- NPİstanbul Beyin Hastanesi — Klinik Psikolog (2021–2022)

SÜREÇ AKIŞI (personele anlatılması gereken adımlar):
1. Önce KSE-53 ve BFI-2 testlerini doldur (online veya kağıt)
2. Randevu al (bu portal üzerinden veya benimle — dijital ikiz — konuşarak)
3. Randevu oluşturulunca referans kodu verilir — MUTLAKA saklanmalı
4. Görüşmeye gel (20 dk). Ben testleri önceden inceliyorum, böylece sıfırdan değil önde başlıyoruz
5. Görüşme sonrası kişiye özel bir görüşme notu/çıktı hazırlıyorum
6. Bu çıktıyı elden teslim alabilir veya referans koduyla benden (dijital ikiz) talep edebilir
7. İsteyen personelle düzenli takip görüşmeleri devam eder
8. Görüşme sonrası kişilik yapısına göre özel bir kitap listesi hazırlıyorum (Keşfet/Kütüphane sayfasından erişilebilir)

KEŞFET / KÜTÜPHANE:
- Bibliyoterapi yöntemiyle seçtiğim kitap alıntıları, videolar ve içerikler paylaşıyorum
- Görüşme sonrası kişiye özel kitap listesi hazırlanır — referans koduyla erişilebilir
- 2.300 kişilik ortak bir kütüphane — personeller de kitap önerileri paylaşabilir ve beğenebilir

GİZLİLİK:
- Tüm görüşmeler, testler ve notlar yalnızca bende kalır
- Amir, müdür veya herhangi bir üst makam bu bilgilere ERİŞEMEZ
- Tüm veriler 256-bit şifreleme ile korunur
- Bu mesleki etik kurallarımın gereğidir
- Kişi gizlilik sorduğunda: "Etik sınırlar içerisinde psikologla konuştuğunuz her şey gizlidir"

REFERANS KODU SİSTEMİ:
- Her randevu oluşturulduğunda kişiye benzersiz bir referans kodu verilir (örn: KPB-A7X3)
- Bu kodu MUTLAKA paylaş ve saklamalarını söyle
- Referans kodu ile yapılabilecekler: randevu sorgula/iptal/değiştir, test durumu kontrol, görüşme özeti/raporu talep et, kişiye özel kitap listesine eriş
- Referans kodu olmadan randevu işlemi YAPMA — kodu sor
- Bu sistem gizliliği korur: başkası senin randevuna erişemez

UNVAN BİLGİSİ:
- Başkan, Başkan Yardımcısı veya Müdür randevu alıyorsa müdürlük yerine unvanını yaz (örn: mudurluk: "Başkan")
- Müdür ise hangi müdürlüğün müdürü olduğunu sor (örn: mudurluk: "Fen İşleri Müdürlüğü")
- Normal personel ise müdürlüğünü sor
- Kişi "ben başkanım" veya "başkan yardımcısıyım" derse müdürlük sorma

RANDEVU ALMA AKIŞI (ÖNEMLİ: MÜMKÜN OLDUĞUNCA AZ MESAJDA TAMAMLA):
1. Kişi "randevu almak istiyorum" dediğinde → tek mesajda sor: "Adınızı, görevinizi (Başkan / Başkan Yardımcısı / Müdür ise belirtiniz, değilse bağlı olduğunuz müdürlüğü yazınız) ve KSE-53 ile BFI-2 testlerini tamamlayıp tamamlamadığınızı öğrenebilir miyim?"
2. Bilgiler gelince → testler tamamlanmadıysa uyar ve durdur. Tamamlandıysa → hangi gün uygun olduğunu sor
3. Gün gelince → check_available_slots ile müsait saatleri göster, saat seçmesini iste
4. Saat seçilince → özet göster + onay iste (İlk Görüşme varsay, farklıysa söylesin)
5. Onay gelince → book_appointment çağır
BİRDEN FAZLA BİLGİYİ AYNI MESAJDA İSTE. Gereksiz tur yapma — mümkünse 3-4 mesajda randevu tamamlanmalı.
Testler ZORUNLUDUR — test tamamlanmadan randevu oluşturma.
Eğer kişi mesajında birden fazla bilgi verdiyse (mesela "Ahmet Yılmaz, Fen İşleri, yarın için") hepsini al ve gereksiz soru sorma.

KURALLAR:
- Türkçe konuş, sıcak ve empatik ol
- Kısa ve net yanıtlar ver (2-3 cümle, uzun paragraflar yazma)
- Önemli kelimeleri ve kavramları **kalın** yaz (markdown bold). Örnek: **gizlidir**, **50 dakika**, **KSE-53**
- Asla klinik tavsiye verme, tanı koyma, ilaç önerme
- Her fırsatta gizlilik vurgula
- Gerçek benimle görüşmeyi her zaman öner`
}

const tools: Tool[] = [
  {
    functionDeclarations: [
      {
        name: "check_available_slots",
        description: "Belirli bir tarih için müsait randevu saatlerini kontrol eder",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            tarih: { type: SchemaType.STRING, description: "YYYY-MM-DD formatında tarih" },
          },
          required: ["tarih"],
        },
      },
      {
        name: "book_appointment",
        description: "Randevu oluşturur ve referans kodu döndürür. Tüm bilgiler toplandıktan sonra çağrılır.",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            adSoyad: { type: SchemaType.STRING, description: "Kişinin ad soyad" },
            mudurluk: { type: SchemaType.STRING, description: "Bağlı olduğu müdürlük. Başkan ise 'Başkan', Başkan Yardımcısı ise 'Başkan Yardımcısı', Müdür ise müdürlük adı yazılır." },
            tarih: { type: SchemaType.STRING, description: "YYYY-MM-DD formatında tarih" },
            saat: { type: SchemaType.STRING, description: "HH:MM formatında saat" },
            gorusmeTuru: { type: SchemaType.STRING, description: "İlk Görüşme, Takip veya Acil" },
            kseDurumu: { type: SchemaType.STRING, description: "KSE-53 test durumu: online veya kagit" },
            bfiDurumu: { type: SchemaType.STRING, description: "BFI-2 test durumu: online veya kagit" },
          },
          required: ["adSoyad", "mudurluk", "tarih", "saat", "gorusmeTuru"],
        },
      },
      {
        name: "lookup_appointment",
        description: "Referans kodu ile randevu durumunu sorgular",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            referansKodu: { type: SchemaType.STRING, description: "Randevu referans kodu (örn: KPB-A7X3)" },
          },
          required: ["referansKodu"],
        },
      },
      {
        name: "cancel_appointment",
        description: "Referans kodu ile randevuyu iptal eder",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            referansKodu: { type: SchemaType.STRING, description: "Randevu referans kodu" },
          },
          required: ["referansKodu"],
        },
      },
      {
        name: "reschedule_appointment",
        description: "Referans kodu ile randevuyu başka bir tarih/saate taşır",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            referansKodu: { type: SchemaType.STRING, description: "Randevu referans kodu" },
            yeniTarih: { type: SchemaType.STRING, description: "Yeni tarih YYYY-MM-DD" },
            yeniSaat: { type: SchemaType.STRING, description: "Yeni saat HH:MM" },
          },
          required: ["referansKodu", "yeniTarih", "yeniSaat"],
        },
      },
      {
        name: "check_test_status",
        description: "Referans kodu ile kişinin test durumunu sorgular (KSE-53, BFI-2 tamamlanmış mı)",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            referansKodu: { type: SchemaType.STRING, description: "Randevu referans kodu" },
          },
          required: ["referansKodu"],
        },
      },
      {
        name: "send_message",
        description: "Psikoloğa mesaj gönderir",
        parameters: {
          type: SchemaType.OBJECT,
          properties: {
            mesaj: { type: SchemaType.STRING, description: "Mesaj içeriği" },
            kategori: { type: SchemaType.STRING, description: "Genel Soru, Öneri, Acil Destek Talebi" },
            anonim: { type: SchemaType.BOOLEAN, description: "Anonim mi?" },
            adSoyad: { type: SchemaType.STRING, description: "İsimli gönderimde ad soyad" },
            mudurluk: { type: SchemaType.STRING, description: "Gönderenin müdürlüğü" },
          },
          required: ["mesaj", "kategori", "anonim"],
        },
      },
    ],
  },
]

// --- Referans kodu üretici ---
function generateRefCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  const bytes = new Uint8Array(8)
  crypto.getRandomValues(bytes)
  let code = "KPB-"
  for (let i = 0; i < 8; i++) code += chars[bytes[i] % chars.length]
  return code
}

// --- Tool implementations ---

async function checkAvailableSlots(tarih: string): Promise<string> {
  const { data: musaitlikRows } = await supabase.from("musaitlik").select("*").order("gun")
  const musaitlik = (musaitlikRows ?? []).map(m => ({
    gun: m.gun, baslangic: m.baslangic, bitis: m.bitis,
    slotDk: m.slot_dk, aktif: m.aktif, kapaliSlotlar: m.kapali_slotlar ?? [],
  }))

  const { data: talepler } = await supabase
    .from("randevu_talepleri")
    .select("istenen_tarih, istenen_saat, durum")
    .eq("istenen_tarih", tarih)
    .neq("durum", "Reddedildi")
    .neq("durum", "İptal")

  const dolu = new Set((talepler ?? []).map(t => t.istenen_saat))
  const d = new Date(tarih + "T12:00:00")
  const weekday = d.getDay() === 0 ? 7 : d.getDay()
  const dayConfig = musaitlik.find(m => m.gun === weekday)

  if (!dayConfig?.aktif) return `${tarih} tarihinde randevu alınamıyor (o gün müsait değil).`

  const kapali = new Set(dayConfig.kapaliSlotlar ?? [])

  // Tarihe ozel kapali slotlar
  const { data: kapaliTarihRows } = await supabase.from("kapali_tarih_slotlari").select("saat").eq("tarih", tarih)
  for (const k of kapaliTarihRows ?? []) kapali.add(k.saat)

  const slots: string[] = []
  const [sh, sm] = dayConfig.baslangic.split(":").map(Number)
  const [eh, em] = dayConfig.bitis.split(":").map(Number)
  let t = sh * 60 + sm
  const end = eh * 60 + em

  while (t + dayConfig.slotDk <= end) {
    const slot = `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`
    if (!dolu.has(slot) && !kapali.has(slot)) slots.push(slot)
    t += dayConfig.slotDk
  }

  if (slots.length === 0) return `${tarih} tarihinde müsait slot kalmamış.`

  const gunAdi = d.toLocaleDateString("tr-TR", { weekday: "long", day: "numeric", month: "long" })
  return `${gunAdi} müsait saatler: ${slots.join(", ")}`
}

async function bookAppointment(params: {
  adSoyad: string; mudurluk: string; tarih: string; saat: string; gorusmeTuru: string
  kseDurumu?: string; bfiDurumu?: string
}): Promise<string> {
  const today = new Date().toISOString().split("T")[0]
  if (params.tarih < today) return "Geçmiş tarihe randevu oluşturulamaz."

  const { data: existing } = await supabase
    .from("randevu_talepleri")
    .select("id")
    .eq("istenen_tarih", params.tarih)
    .eq("istenen_saat", params.saat)
    .neq("durum", "Reddedildi")
    .neq("durum", "İptal")
    .limit(1)

  if (existing && existing.length > 0) return "Bu saat dolu. Lütfen başka bir saat seçin."

  const refCode = generateRefCode()

  const { error } = await supabase.from("randevu_talepleri").insert({
    id: crypto.randomUUID(),
    ad_soyad: params.adSoyad,
    mudurluk: params.mudurluk,
    gorusme_turu: params.gorusmeTuru,
    istenen_tarih: params.tarih,
    istenen_saat: params.saat,
    durum: "Bekliyor",
    kaynak: "chatbot",
    referans_kodu: refCode,
    kse_durumu: params.kseDurumu || null,
    bfi_durumu: params.bfiDurumu || null,
  })

  if (error) {
    if ((error as { code?: string }).code === "23505") return "Bu saat az önce doldu. Lütfen başka bir saat seçin."
    return "Randevu oluşturulurken bir hata oluştu. Lütfen tekrar deneyin."
  }

  const gunAdi = new Date(params.tarih + "T12:00:00").toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long",
  })
  return `Randevu talebiniz oluşturuldu! Tarih: ${gunAdi}, saat ${params.saat}. Referans kodunuz: ${refCode} — Bu kodu mutlaka saklayın! Randevunuzu sorgulamak, iptal etmek veya değiştirmek için bu koda ihtiyacınız olacak.`
}

async function lookupAppointment(referansKodu: string): Promise<string> {
  const { data } = await supabase
    .from("randevu_talepleri")
    .select("istenen_tarih, istenen_saat, durum, gorusme_turu")
    .eq("referans_kodu", referansKodu.toUpperCase())
    .limit(1)

  if (!data || data.length === 0) return "Bu referans koduna ait randevu bulunamadı. Kodu kontrol edin."

  const r = data[0]
  const gunAdi = new Date(r.istenen_tarih + "T12:00:00").toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long",
  })
  return `Randevu bilgileri — Tarih: ${gunAdi}, Saat: ${r.istenen_saat}, Tür: ${r.gorusme_turu}, Durum: ${r.durum}`
}

async function cancelAppointment(referansKodu: string): Promise<string> {
  const { data } = await supabase
    .from("randevu_talepleri")
    .select("id, durum")
    .eq("referans_kodu", referansKodu.toUpperCase())
    .limit(1)

  if (!data || data.length === 0) return "Bu referans koduna ait randevu bulunamadı."
  if (data[0].durum === "İptal") return "Bu randevu zaten iptal edilmiş."

  const { error } = await supabase
    .from("randevu_talepleri")
    .update({ durum: "İptal" })
    .eq("id", data[0].id)

  if (error) return "İptal işlemi sırasında bir hata oluştu."
  return "Randevunuz başarıyla iptal edildi."
}

async function rescheduleAppointment(referansKodu: string, yeniTarih: string, yeniSaat: string): Promise<string> {
  const { data } = await supabase
    .from("randevu_talepleri")
    .select("id, durum")
    .eq("referans_kodu", referansKodu.toUpperCase())
    .limit(1)

  if (!data || data.length === 0) return "Bu referans koduna ait randevu bulunamadı."
  if (data[0].durum === "İptal") return "İptal edilmiş randevu değiştirilemez. Yeni randevu oluşturabilirsiniz."

  const { data: existing } = await supabase
    .from("randevu_talepleri")
    .select("id")
    .eq("istenen_tarih", yeniTarih)
    .eq("istenen_saat", yeniSaat)
    .neq("durum", "Reddedildi")
    .neq("durum", "İptal")
    .limit(1)

  if (existing && existing.length > 0) return "Seçilen yeni saat dolu. Lütfen başka bir saat deneyin."

  const { error } = await supabase
    .from("randevu_talepleri")
    .update({ istenen_tarih: yeniTarih, istenen_saat: yeniSaat, durum: "Bekliyor" })
    .eq("id", data[0].id)

  if (error) return "Değiştirme işlemi sırasında bir hata oluştu."

  const gunAdi = new Date(yeniTarih + "T12:00:00").toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long",
  })
  return `Randevunuz güncellendi: ${gunAdi}, saat ${yeniSaat}. Referans kodunuz aynı: ${referansKodu.toUpperCase()}`
}

async function checkTestStatus(referansKodu: string): Promise<string> {
  const { data: randevu } = await supabase
    .from("randevu_talepleri")
    .select("ad_soyad")
    .eq("referans_kodu", referansKodu.toUpperCase())
    .limit(1)

  if (!randevu || randevu.length === 0) return "Bu referans koduna ait kayıt bulunamadı."

  const { data: testler } = await supabase
    .from("test_sonuclari")
    .select("test_turu, tarih")
    .eq("ad_soyad", randevu[0].ad_soyad)

  if (!testler || testler.length === 0) {
    return "Henüz tamamlanmış test bulunmuyor. KSE-53 ve BFI-2 testlerini portalımızdaki Testler bölümünden doldurabilirsiniz."
  }

  const kse = testler.find(t => t.test_turu === "KSE-53")
  const bfi = testler.find(t => t.test_turu === "BFI-2")

  return `Test durumu:\nKSE-53: ${kse ? "Tamamlandı (" + new Date(kse.tarih).toLocaleDateString("tr-TR") + ")" : "Henüz yapılmadı"}\nBFI-2: ${bfi ? "Tamamlandı (" + new Date(bfi.tarih).toLocaleDateString("tr-TR") + ")" : "Henüz yapılmadı"}`
}

async function sendMessage(params: {
  mesaj: string; kategori: string; anonim: boolean; adSoyad?: string; mudurluk?: string
}): Promise<string> {
  const { error } = await supabase.from("mesajlar").insert({
    anonim: params.anonim,
    ad_soyad: params.anonim ? null : (params.adSoyad || null),
    mudurluk: params.anonim ? null : (params.mudurluk || null),
    kategori: params.kategori,
    mesaj: params.mesaj,
  })

  if (error) return "Mesaj gönderilemedi. Lütfen tekrar deneyin."
  return "Mesajınız bana iletildi. Teşekkür ederim, en kısa sürede değerlendireceğim."
}

async function getReport(referansKodu: string): Promise<string> {
  const { data, error } = await supabase
    .from("danisan_raporlari")
    .select("rapor_turu, icerik, ozet, olusturma_tarihi")
    .eq("referans_kodu", referansKodu.toUpperCase())
    .eq("gorunur", true)
    .order("olusturma_tarihi", { ascending: false })

  if (error) return "Rapor sorgulanırken bir hata oluştu. Lütfen tekrar deneyin."
  if (!data || data.length === 0) return `${referansKodu} koduna ait henüz hazırlanmış bir rapor bulunmuyor. Görüşmeniz sonrasında raporunuz hazırlandığında buradan erişebilirsiniz.`

  const raporlar = data.map(r => {
    const tarih = new Date(r.olusturma_tarihi).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    const turLabel: Record<string, string> = {
      seans_ozeti: "Seans Özeti",
      test_degerlendirme: "Test Değerlendirmesi",
      takip_plani: "Takip Planı",
    }
    return `📋 **${turLabel[r.rapor_turu] || r.rapor_turu}** (${tarih})\n${r.ozet ? `_${r.ozet}_\n\n` : ""}${r.icerik}`
  })

  return `${referansKodu} koduna ait ${data.length} rapor bulundu:\n\n${raporlar.join("\n\n---\n\n")}`
}

async function executeTool(name: string, args: Record<string, unknown>): Promise<string> {
  try {
  switch (name) {
    case "check_available_slots":
      return checkAvailableSlots(args.tarih as string)
    case "book_appointment":
      return bookAppointment(args as Parameters<typeof bookAppointment>[0])
    case "lookup_appointment":
      return lookupAppointment(args.referansKodu as string)
    case "cancel_appointment":
      return cancelAppointment(args.referansKodu as string)
    case "reschedule_appointment":
      return rescheduleAppointment(args.referansKodu as string, args.yeniTarih as string, args.yeniSaat as string)
    case "check_test_status":
      return checkTestStatus(args.referansKodu as string)
    case "send_message":
      return sendMessage(args as Parameters<typeof sendMessage>[0])
    default:
      return "Bu işlem desteklenmiyor."
  }
  } catch (e) {
    console.error(`[chat] Tool "${name}" error:`, e)
    return "Bu işlemi şu an gerçekleştiremiyorum. Lütfen daha sonra tekrar deneyin."
  }
}

// --- Main handler ---

export async function POST(request: NextRequest) {
  const ip = getClientIp(request)
  if (isRateLimited(ip, 10, 60_000)) {
    return NextResponse.json({ error: "Çok fazla istek. Lütfen bir dakika bekleyin." }, { status: 429 })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error("[chat] GEMINI_API_KEY is not set")
    return NextResponse.json({ error: "Şu an yanıt veremiyorum. Lütfen biraz sonra tekrar deneyin." }, { status: 500 })
  }

  let body: { messages: Array<{ role: string; content: string }> }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 })
  }

  if (!body.messages || !Array.isArray(body.messages) || body.messages.length === 0) {
    return NextResponse.json({ error: "Mesaj gerekli." }, { status: 400 })
  }

  // Validate and sanitize message history
  const validMessages = body.messages
    .filter(m => m && typeof m.content === "string" && m.content.trim().length > 0)
    .slice(-30) // Max 30 mesaj — API abuse önlemi
  if (validMessages.length === 0) {
    return NextResponse.json({ error: "Mesaj içeriği boş." }, { status: 400 })
  }

  const history: Content[] = validMessages.slice(0, -1).map(m => ({
    role: m.role === "user" ? "user" : "model",
    parts: [{ text: String(m.content) }],
  }))

  const lastMessage = String(validMessages[validMessages.length - 1].content)
  const genAI = new GoogleGenerativeAI(apiKey)

  try {
    const model = genAI.getGenerativeModel({
      model: MODEL,
      systemInstruction: getSystemPrompt(),
      tools,
    })

    // Retry — 429 rate limit’te Gemini’nin bekleme süresini parse et
    async function sendWithRetry(chat: ReturnType<typeof model.startChat>, msg: Parameters<typeof chat.sendMessage>[0]) {
      for (let i = 0; i < 3; i++) {
        try {
          return await chat.sendMessage(msg)
        } catch (e: unknown) {
          const errObj = e instanceof Error ? e : new Error(String(e))
          const status = (e as { status?: number }).status
          const message = errObj.message || ""

          if (status === 429 && i < 2) {
            // Hata mesajından bekleme süresini parse et: "retry in 39.87s"
            let waitMs = 42000 // varsayılan 42s
            const match = message.match(/retry in ([\d.]+)s/i)
            if (match) {
              waitMs = Math.ceil(parseFloat(match[1]) * 1000) + 2000
            }
            console.log(`[chat] 429 rate limit, retry ${i + 1}/2, waiting ${Math.round(waitMs / 1000)}s`)
            await new Promise(r => setTimeout(r, waitMs))
            continue
          }
          throw e
        }
      }
      throw new Error("Rate limit aşıldı — lütfen biraz bekleyin")
    }

    const chat = model.startChat({ history })
    let result = await sendWithRetry(chat, lastMessage)
    let response = result.response
    let attempts = 0
    let lastToolResult = ""

    while (response.candidates?.[0]?.content?.parts?.some(p => 'functionCall' in p) && attempts < 5) {
      const functionCallPart = response.candidates[0].content.parts.find(p => 'functionCall' in p)
      if (!functionCallPart || !('functionCall' in functionCallPart)) break

      const fc = functionCallPart.functionCall!
      lastToolResult = await executeTool(fc.name, fc.args as Record<string, unknown>)

      result = await sendWithRetry(chat, [{
        functionResponse: { name: fc.name, response: { result: lastToolResult } },
      }])
      response = result.response
      attempts++
    }

    let text = ""
    try { text = response.text?.() ?? "" } catch { text = "" }
    const finalMessage = text || lastToolResult || "İşleminiz gerçekleştirildi."
    return NextResponse.json({ message: finalMessage, model: MODEL })

  } catch (err: unknown) {
    const errMsg = err instanceof Error ? err.message : String(err)
    console.error(`[chat] ${MODEL} error:`, errMsg)
    return NextResponse.json(
      { error: "Şu an yanıt veremiyorum. Lütfen tekrar deneyin." },
      { status: 500 }
    )
  }
}
