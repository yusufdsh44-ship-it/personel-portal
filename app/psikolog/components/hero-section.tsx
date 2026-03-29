"use client"

import Link from "next/link"
import { FadeIn, FadeInView, motion } from "../../components/motion"
import { TimelineSection } from "./timeline-section"

function Pill({ href, icon, children }: { href: string; icon: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="inline-flex items-center gap-[3px] bg-primary/[0.08] text-primary font-bold rounded-md px-1.5 py-[1px] hover:bg-primary/15 active:scale-[0.97] transition-all border border-primary/[0.12] align-baseline text-[0.9em] leading-normal">
      <span className="material-symbols-outlined" style={{ fontSize: "0.95em" }}>{icon}</span>
      {children}
    </Link>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 items-start">
      <span className="material-symbols-outlined text-primary/40 text-base mt-0.5 shrink-0">arrow_right</span>
      <span>{children}</span>
    </li>
  )
}

export function HeroSection() {
  return (
    <section className="relative">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/[0.03] via-transparent to-transparent" />

      <div className="max-w-xl mx-auto px-5 pt-24 pb-6">
        {/* Giriş */}
        <FadeInView delay={0.1}>
          <p className="text-on-surface text-[17px] sm:text-lg leading-[1.9] mb-10">
            <span className="float-left text-5xl font-extrabold text-primary/50 leading-[0.85] mr-2 mt-1 font-headline select-none">M</span>erhaba, ben Yusuf. Kurum psikoloğu olarak sizleri ve kurumu tanıma sürecinde yaptığımız müdürlük ziyaretleri çok değerli olmuştu, çalışan memnuniyeti anketine katılarak da bu sürece büyük katkı sağladınız. Şimdi <strong className="text-on-surface">bir adım öteye geçip sizinle birebir görüşmek</strong>, sizi yakından tanımak ve birlikte neler yapabileceğimizi konuşmak isterim.
          </p>
        </FadeInView>

        {/* Kartlar */}
        <div className="space-y-4">

          {/* 🎯 Sürecin İlk Adımı */}
          <FadeInView delay={0.15}>
            <Card step={1} icon="target" accent="from-primary/10 to-transparent" iconBg="bg-primary" title="Sürecin İlk Adımı">
              <Bullet>Belediyemizdeki <strong>2.300 personelin her biriyle bire bir tanışma görüşmesi</strong> gerçekleştiriyorum.</Bullet>
              <Bullet>Görüşme sırası müdürlüğünüze geldiğinde, önce <strong>KSE-53 ve BFI-2 testlerini</strong> doldurmanız gerekmektedir. <Pill href="/testler" icon="assignment">Testler</Pill> sayfasından online doldurabilir ya da PDF çıktısını alıp elden getirebilirsiniz.</Bullet>
              <Bullet>Ardından <Pill href="/" icon="event_available">Randevu</Pill> sayfasından doğrudan ya da <Pill href="/sohbet" icon="smart_toy">Chat</Pill> kısmından dijital ikizimle konuşarak müsaitliğinize göre randevunuzu kolayca oluşturabilirsiniz.</Bullet>
              <Bullet><strong>Randevu sonrası size özel bir referans numarası</strong> verilecek. Bu numara ile randevunuzu iptal edebilir, değiştirebilir, görüşme özetinizi talep edebilir ve size özel birçok özelliği kullanabilirsiniz. <strong>Bu numarayı lütfen saklayın.</strong></Bullet>
            </Card>
          </FadeInView>

          {/* 🤝 Görüşme — Size Özel */}
          <FadeInView delay={0.2}>
            <Card step={2} icon="handshake" accent="from-teal-100/60 to-transparent" iconBg="bg-teal-600" title="Görüşme — Size Özel">
              <Bullet>Ben testlerinizi <strong>görüşmeden önce detaylıca inceliyorum</strong>. Böylece karşılaştığımızda sıfırdan değil, <strong>önde başlıyoruz</strong>.</Bullet>
              <Bullet>Kişilik yapınızı, sizi siz yapan dinamikleri birlikte keşfediyor, güçlü yönlerinizi birlikte fark ediyoruz.</Bullet>
            </Card>
          </FadeInView>

          {/* 📄 Görüşme Sonrası */}
          <FadeInView delay={0.25}>
            <Card step={3} icon="description" accent="from-blue-50/60 to-transparent" iconBg="bg-blue-500" title="Görüşme Sonrası — Görüşme Çıktınız">
              <Bullet>Görüşmemizin ardından elinize somut bir çıktı geçiyor: <strong>sizin için özel bir görüşme notu</strong>. Konuştuklarımız, birlikte fark ettiğimiz güçlü yönleriniz ve birlikte belirlediğimiz sonraki adımlar.</Bullet>
              <Bullet>Böylece konuştuklarımız sadece o ana ait kalmıyor, <strong>her zaman sizde kalıyor</strong>.</Bullet>
              <Bullet>İster elden teslim alabilirsiniz, ister <strong>referans numaranızla</strong> <Pill href="/sohbet" icon="smart_toy">Chat</Pill> kısmından dijital ikizimden talep edebilirsiniz.</Bullet>
            </Card>
          </FadeInView>

          {/* 🔄 Düzenli Görüşmeler */}
          <FadeInView delay={0.3}>
            <Card step={4} icon="event_repeat" accent="from-indigo-50/50 to-transparent" iconBg="bg-indigo-500" title="Düzenli Görüşmeler">
              <Bullet>İlk görüşme <strong>tüm personelimizi</strong> kapsıyor.</Bullet>
              <Bullet>Sonrasında, ortaya çıkan farkındalıkları derinleştirmek ve birlikte belirlediğimiz adımları takip etmek isteyen personelimizle <strong>düzenli görüşmelere</strong> devam ediyorum.</Bullet>
            </Card>
          </FadeInView>

          {/* 🤖 Dijital İkiz */}
          <FadeInView delay={0.35}>
            <Card step={5} icon="smart_toy" accent="from-emerald-50/70 to-transparent" iconBg="bg-emerald-600" title="Dijital İkiz — 7/24 Yanınızda">
              <Bullet><Pill href="/sohbet" icon="smart_toy">Chat</Pill> sayfasındaki dijital ikizim üzerinden <strong>randevunuzla ilgili her işlemi</strong> yapabilirsiniz.</Bullet>
              <Bullet>Süreç hakkında bilgi edinebilir ya da aklınıza takılan her şeyi sorabilirsiniz.</Bullet>
              <Bullet>Mesai saati gözetmeksizin, <strong>günün her saati</strong>.</Bullet>
            </Card>
          </FadeInView>

          {/* 📚 Keşfet — Bibliyoterapi */}
          <FadeInView delay={0.4}>
            <Card step={6} icon="explore" accent="from-amber-50/80 to-transparent" iconBg="bg-amber-500" title="Keşfet — Bibliyoterapi">
              <Bullet><strong>Bibliyoterapi</strong>, kitapların iyileştirici gücünü kullanan bilimsel bir yöntem. <Pill href="/kutuphane" icon="explore">Keşfet</Pill> sayfasında sizin için seçtiğim kitap alıntıları, videolar ve içerikler paylaşıyorum.</Bullet>
              <Bullet>Her görüşme sonrası konuştuklarımıza ve kişilik yapınıza göre <strong>size özel bir kitap listesi</strong> hazır olacak. Referans numaranızla ulaşabilirsiniz.</Bullet>
              <Bullet><strong>2.300 kişilik ortak bir kütüphane</strong>. Siz de bir kitaptan etkilendiğiniz bir bölümü paylaşabilir, diğer personelimizin paylaşımlarını görebilir ve beğenebilirsiniz.</Bullet>
            </Card>
          </FadeInView>

          {/* ✉️ Her Zaman Ulaşabilirsiniz */}
          <FadeInView delay={0.45}>
            <Card step={7} icon="mail" accent="from-violet-50/60 to-transparent" iconBg="bg-violet-500" title="Her Zaman Ulaşabilirsiniz">
              <Bullet>Aşağıdaki <Pill href="/mesaj" icon="edit_note">Mesaj</Pill> kısmından veya <Pill href="/sohbet" icon="smart_toy">Chat</Pill> kısmından <strong>anonim ya da isimli</strong> olarak bana ulaşabilirsiniz.</Bullet>
              <Bullet>Mesajlarınızı okuyor ve <strong>en kısa sürede dönüş yapıyorum</strong>.</Bullet>
            </Card>
          </FadeInView>

          {/* 🔒 Gizlilik */}
          <FadeInView delay={0.5}>
            <Card step={8} icon="verified_user" accent="from-slate-50/60 to-transparent" iconBg="bg-slate-600" title="Gizlilik">
              <Bullet>Testleriniz, görüşmelerimiz ve tüm notlar <strong>yalnızca bende kalır</strong>.</Bullet>
              <Bullet>Amiriniz veya müdürünüz bu bilgilere <strong>erişemez</strong>.</Bullet>
              <Bullet>Tüm veriler <strong>256-bit şifreleme</strong> ile korunur. Bu mesleki etik kurallarımın gereği.</Bullet>
            </Card>
          </FadeInView>

          {/* İmza + Psikolog Kimdir */}
          <FadeInView delay={0.55}>
            <div className="rounded-2xl border border-outline-variant/10 overflow-hidden bg-white/40">
              {/* İmza */}
              <div className="flex items-center gap-4 px-5 py-5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-container to-primary/20 flex items-center justify-center shrink-0 ring-2 ring-white/60 shadow-lg shadow-primary/10">
                  <span className="material-symbols-outlined text-primary text-xl">psychology</span>
                </div>
                <div>
                  <p className="text-on-surface-variant italic text-[15px]">Görüşmek dileğiyle,</p>
                  <p className="text-on-surface font-headline font-extrabold text-base mt-0.5">Uzm. Kl. Psk. Yusuf Pamuk</p>
                  <div className="flex items-center gap-2 text-[11px] text-on-surface-variant/50 mt-0.5">
                    <span>Dahili 4405</span>
                    <span>·</span>
                    <span>Pzt–Cum 09:00–17:00</span>
                  </div>
                </div>
              </div>
              {/* Kurumsal Psikolog Kimdir */}
              <details className="group border-t border-outline-variant/10">
                <summary className="flex items-center gap-3 cursor-pointer select-none py-3 px-5 hover:bg-white/50 transition-all list-none">
                  <span className="material-symbols-outlined text-primary/60 text-lg">badge</span>
                  <span className="font-headline font-bold text-on-surface text-sm flex-1">Kurumsal Psikolog <span className="font-normal text-on-surface-variant/60">(Yusuf Pamuk)</span> Kimdir?</span>
                  <span className="material-symbols-outlined text-on-surface-variant/40 text-lg transition-transform duration-300 group-open:rotate-180">expand_more</span>
                </summary>
                <div className="pt-2 pb-2">
                  <TimelineSection />
                </div>
              </details>
            </div>
          </FadeInView>
        </div>
      </div>
    </section>
  )
}

/* ── Section Card ──────────────────────── */

function Card({ icon, accent, iconBg, title, step, children }: {
  icon: string; accent: string; iconBg: string; title: string; step?: number; children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-outline-variant/10 overflow-hidden bg-white/40">
      <div className={`px-5 py-4 flex items-center gap-3 bg-gradient-to-r ${accent}`}>
        <div className={`relative w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0 shadow-sm`}>
          <span className="material-symbols-outlined text-white text-xl">{icon}</span>
          {step != null && (
            <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center">
              <span className="text-[10px] font-extrabold text-on-surface">{step}</span>
            </div>
          )}
        </div>
        <h2 className="font-headline font-extrabold text-on-surface text-[17px]">{title}</h2>
      </div>
      <ul className="px-5 py-5 space-y-3.5 text-on-surface-variant text-[15px] leading-[1.85] [&_strong]:text-on-surface [&_strong]:font-semibold">
        {children}
      </ul>
    </div>
  )
}
