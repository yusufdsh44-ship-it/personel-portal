// Psikolog sayfası statik verileri

export interface Stat {
  value: number
  suffix: string
  label: string
  icon: string
}

export interface Faq {
  q: string
  a: string
}

export const STATS: Stat[] = [
  { value: 2240, suffix: "+", label: "Destek Verilen Personel", icon: "groups" },
  { value: 4, suffix: "+", label: "Yıl Klinik Deneyim", icon: "workspace_premium" },
  { value: 31, suffix: "", label: "Müdürlük Kapsam", icon: "corporate_fare" },
  { value: 20, suffix: "dk", label: "Seans Süresi", icon: "schedule" },
]

export const FAQS: Faq[] = [
  { q: "Görüşmeler gizli mi? Amirim bilecek mi?", a: "Görüşmeleriniz tamamen gizlidir. Yöneticiniz, müdürünüz veya herhangi bir üst makam bilgilendirilmez. Psikolojik destek süreciniz etik kurallar gereği sadece psikolog ile aranızda kalır." },
  { q: "İlk görüşmede beni neler bekliyor?", a: "İlk görüşmemiz bir tanışma seansıdır. Sizi tanımak, yaşadığınız zorlukları anlamak ve ihtiyaçlarınızı belirlemek için rahat bir sohbet ortamında gerçekleşir. Kendinizi rahat hissetmeniz önceliğimizdir." },
  { q: "Süreç nasıl işliyor?", a: "Randevu aldıktan sonra birimimize gelmeniz yeterli. Görüşme süresi ortalama 20 dakikadır. İhtiyaca göre takip görüşmeleri planlanabilir. Tüm süreç sizin onayınız ve katılımınızla ilerler." },
]

export interface EgitimItem {
  logo?: string
  title: string
  sub: string
  meta: string
}

export interface DeneyimItem {
  logo?: string
  initials: string
  title: string
  role: string
  period: string
  current?: boolean
  featured?: boolean
}

export interface Yetkinlik {
  kategori: string
  icon: string
  items: string[]
}

export const EGITIM: EgitimItem[] = [
  { logo: "/logos/galatasaray.png", title: "Galatasaray Üniversitesi", sub: "Stratejik İletişim — Yüksek Lisans", meta: "2025 – Devam Ediyor" },
  { logo: "/logos/uskudar.webp", title: "Üsküdar Üniversitesi", sub: "Klinik Psikoloji — Yüksek Lisans", meta: "2021 – 2022 · Onur Derecesi · GPA: 3.42/4.00" },
  { logo: "/logos/medipol.svg", title: "Medipol Üniversitesi", sub: "Psikoloji — Lisans", meta: "2016 – 2020 · Onur Derecesi · GPA: 3.37/4.00" },
  { title: "Università degli Studi di Torino", sub: "Erasmus Stajı — Psikoloji", meta: "2020 · Torino, İtalya" },
]

export const PROGRAMLAR: EgitimItem[] = [
  { logo: "/logos/seta.png", title: "SETA Vakfı", sub: "Araştırmacı Stajyer — Avrupa Çalışmaları", meta: "2020 · İstanbul" },
  { title: "WAT — United States of America", sub: "New York", meta: "2019 · 4 ay" },
]

export const DENEYIM: DeneyimItem[] = [
  { logo: "/logos/arnavutkoy.png", initials: "AB", title: "Arnavutköy Belediyesi", role: "Kurum Psikoloğu — Kurumsal Psikoloji Birimi", period: "Halen", current: true, featured: true },
  { logo: "/logos/enerji-bakanligi.png", initials: "TN", title: "Enerji ve Tabii Kaynaklar Bakanlığı (TÜNAŞ)", role: "Kurum Psikoloğu", period: "2024" },
  { logo: "/logos/frenchlape.png", initials: "FL", title: "Fransız Lape Psikiyatri Hastanesi", role: "Klinik Psikolog", period: "2023 – 2024" },
  { logo: "/logos/npistanbul.png", initials: "NP", title: "NP İstanbul Beyin Hastanesi", role: "Klinik Psikolog", period: "2021 – 2022" },
]



export const YETKINLIKLER: Yetkinlik[] = [
  {
    kategori: "Terapötik Yaklaşımlar",
    icon: "neurology",
    items: [
      "Bilişsel Davranışçı Terapi (BDT)",
      "Şema Terapi",
      "EMDR (Göz Hareketleri ile Duyarsızlaştırma)",
      "Çözüm Odaklı Kısa Terapi",
      "Motivasyonel Görüşme",
      "Psikoeğitim",
    ],
  },
  {
    kategori: "Yardım Edebileceğim Konular",
    icon: "support",
    items: [
      "Depresyon ve Duygudurum Bozuklukları",
      "Anksiyete ve Panik Atak",
      "Travma Sonrası Stres (TSSB)",
      "Tükenmişlik Sendromu",
      "Uyum Güçlükleri ve Stres Yönetimi",
      "Yas, Kayıp ve Keder Süreci",
      "Öfke Kontrolü",
      "Kriz Durumları",
    ],
  },
  {
    kategori: "Klinik Değerlendirme",
    icon: "assignment",
    items: [
      "Yapılandırılmış Klinik Görüşme",
      "Psikometrik Test Uygulaması",
      "Risk ve Güvenlik Değerlendirmesi",
      "Kişilik Değerlendirmesi",
    ],
  },
  {
    kategori: "Uygulanan Ölçekler",
    icon: "lab_research",
    items: [
      "KSE-53 Semptom Envanteri",
      "BFI-2 Kişilik Envanteri",
      "Beck Depresyon Envanteri (BDI)",
      "Beck Anksiyete Envanteri (BAI)",
      "Maslach Tükenmişlik Ölçeği",
      "JD-R İş Talepleri-Kaynakları Anketi",
    ],
  },
  {
    kategori: "Kurumsal Psikoloji",
    icon: "corporate_fare",
    items: [
      "Çalışan Ruh Sağlığı Programları",
      "Tükenmişlik ve İş Stresi Önleme",
      "Mobbing / İşyeri Zorbalığı Değerlendirmesi",
      "Kurumsal Risk Analizi",
      "Yönetici Danışmanlığı",
    ],
  },
]
