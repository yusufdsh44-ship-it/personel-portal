"use client"

import { Header } from "../components/header"
import { FadeIn, FadeInView } from "../components/motion"

const ARTICLES = [
  { featured: true, title: "İş Yerinde Tükenmişlik Sendromu: Belirtiler ve Başa Çıkma", desc: "Sürekli yorgunluk, motivasyon kaybı ve duygusal tükenme hissediyorsanız yalnız değilsiniz. Tükenmişlik sendromunu tanımak ve erken müdahale yöntemlerini keşfedin.", date: "20 Mart 2026", time: "8 Dakika", tag: "Öne Çıkan", img: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&q=80" },
  { title: "Yöneticinizle Sağlıklı İletişim Kurmanın Yolları", desc: "İş yerinde üst yönetimle yaşanan iletişim sorunları stresin en büyük kaynağı olabilir. Etkili iletişim teknikleri ve sınır koyma stratejileri.", date: "15 Mart 2026", time: "5 Dakika", img: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=600&q=80" },
  { title: "Mobbing Nedir? Fark Etmek ve Harekete Geçmek", desc: "Mobbing'in belirtilerini tanımak ilk adımdır. Yasal haklarınızı, başvuru yollarınızı ve kendinizi koruma stratejilerini öğrenin. Yanınızdayız.", date: "10 Mart 2026", time: "7 Dakika", img: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=600&q=80" },
  { title: "İş-Yaşam Dengesi Neden Önemli?", desc: "Mesai saatleri dışında da işi düşünmekten kendinizi alamıyor musunuz? Sağlıklı sınırlar oluşturarak hem işte hem hayatta daha verimli olmanın yolları.", date: "5 Mart 2026", time: "6 Dakika", img: "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=600&q=80" },
]

export default function BlogPage() {
  return (
    <>
      <Header />
      <div className="pt-24 pb-8 px-6 max-w-4xl mx-auto">
        <FadeIn>
        <section className="mb-12">
          <h1 className="font-headline text-4xl font-extrabold text-on-surface tracking-tight leading-tight mb-4">Haftalık İçerikler</h1>
          <p className="text-on-surface-variant text-lg max-w-2xl">İş yaşamınızda ruh sağlığınızı korumak için özenle hazırlanan haftalık rehberler ve yazılar.</p>
        </section>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {ARTICLES.map((a, i) => (
            <FadeInView key={i} delay={i * 0.1}>
            <article className={`${a.featured ? "md:col-span-2" : ""} group glass-card rounded-3xl border border-white/20 overflow-hidden transition-all hover:shadow-xl hover:shadow-primary/5`}>
              <div className={`${a.featured ? "aspect-[21/9]" : "aspect-video"} overflow-hidden`}>
                <img src={a.img} alt={a.title} loading="lazy" decoding="async" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className={`${a.featured ? "p-8" : "p-6"}`}>
                {a.tag && (
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary-container text-xs font-semibold uppercase tracking-wider">{a.tag}</span>
                    <span className="text-on-surface-variant text-sm flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">calendar_today</span> {a.date}
                    </span>
                  </div>
                )}
                <h2 className={`font-headline ${a.featured ? "text-2xl md:text-3xl" : "text-xl"} font-bold text-on-surface mb-2 group-hover:text-primary transition-colors`}>{a.title}</h2>
                <p className="text-on-surface-variant text-sm line-clamp-2 mb-4 leading-relaxed">{a.desc}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-primary font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">timer</span> {a.time}
                  </span>
                  {a.featured ? (
                    <button className="bg-primary text-on-primary px-6 py-2.5 rounded-full font-semibold text-sm hover:opacity-90 active:scale-95 shadow-md shadow-primary/10 transition-all">Devamını Oku</button>
                  ) : (
                    <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">arrow_forward</span>
                  )}
                </div>
              </div>
            </article>
            </FadeInView>
          ))}
        </div>
      </div>
    </>
  )
}
