import QRCode from 'qrcode';
import { api } from '@/lib/api';

/**
 * Mobil uygulama şeridi.
 *
 * Uygulama henüz yok — bu yüzden mağaza rozetleri **tıklanmıyor** ve üzerinde
 * "Yakında" yazıyor. Çalışır görünen ama hiçbir yere gitmeyen bir mağaza
 * bağlantısı müşteriyi bir kere kandırıp güveni kalıcı olarak zedeliyor.
 *
 * Karekod ise SAHTE DEĞİL: sitenin kendi adresini taşıyor. Masaüstünde siteye
 * bakan biri telefonuna geçmek için okutabiliyor — yani bugün de işe yarıyor.
 * Adres `NEXT_PUBLIC_SITE_URL` değişkeninden geliyor; canlıda orası değişince
 * karekod da kendiliğinden doğru adresi gösterir.
 */

const SITE_ADRESI = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

/** Şeritteki telefon maketinde gösterilecek yemek. */
const MAKET_GORSEL = 'products/tikabasa-pilav-cin-usulu-tavuk-pirinc-pilavi.webp';

const AYRICALIKLAR = [
  'Siparişin hazır olunca anında bildirim',
  'Geçmiş siparişini tek dokunuşla tekrarla',
  'Sana özel kampanyalar ve şubeye özel fırsatlar',
];

export async function MobilUygulama() {
  // Karekod sunucuda üretiliyor; istemci paketine kütüphane girmiyor.
  const karekod = await QRCode.toString(SITE_ADRESI, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#173d2b', light: '#00000000' },
  });

  // Üst boşluk yok: bir üstteki "Nasıl çalışır" bölümü de koyu yeşil. Aradaki
  // boşluk krem sayfa zeminini açığa çıkarıp iki koyu bölümün arasında ince
  // beyaz bir şerit gibi görünüyordu.
  return (
    <section className="bg-orman-800 text-krem-100">
      <div className="kabuk py-16 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-altin-400/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-altin-300">
              <span aria-hidden className="size-1.5 rounded-full bg-altin-400" />
              Çok yakında
            </span>

            <h2 className="mt-5 max-w-xl text-balance font-display text-3xl font-semibold leading-tight text-krem-50 sm:text-4xl">
              Size özel kampanyalar ve çok daha fazlası mobil uygulamamızda
            </h2>

            <p className="mt-4 max-w-lg leading-relaxed text-orman-200">
              Hürmet Gel Al uygulaması yolda. Şimdilik siteden sipariş verebilir, karekodu
              okutarak telefonundan devam edebilirsin.
            </p>

            <ul className="mt-8 space-y-3">
              {AYRICALIKLAR.map((madde) => (
                <li key={madde} className="flex items-start gap-3 text-sm text-krem-200">
                  <span
                    aria-hidden
                    className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-altin-400/20 text-altin-300"
                  >
                    <svg viewBox="0 0 16 16" fill="none" className="size-3">
                      <path
                        d="m3.5 8.5 3 3 6-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  {madde}
                </li>
              ))}
            </ul>

            <div className="mt-9 flex flex-wrap items-center gap-5">
              <div className="flex items-center gap-4 rounded-2xl bg-krem-50 p-4 shadow-kart-uzeri">
                <div
                  aria-hidden
                  className="size-24 shrink-0 [&>svg]:h-full [&>svg]:w-full"
                  dangerouslySetInnerHTML={{ __html: karekod }}
                />
                <p className="max-w-[9rem] text-xs leading-relaxed text-orman-600">
                  Kameranla okut,
                  <br />
                  <span className="font-medium text-orman-800">telefonunda devam et</span>
                </p>
              </div>

              <div className="flex flex-col gap-2.5">
                {['App Store', 'Google Play'].map((magaza) => (
                  <span
                    key={magaza}
                    aria-disabled="true"
                    title="Uygulama henüz yayınlanmadı"
                    className="flex w-44 cursor-not-allowed items-center gap-3 rounded-xl border border-orman-600 bg-orman-900/40 px-4 py-2.5"
                  >
                    <svg viewBox="0 0 24 24" aria-hidden className="size-5 text-orman-300">
                      <rect
                        x="6"
                        y="2.5"
                        width="12"
                        height="19"
                        rx="2.5"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        fill="none"
                      />
                      <path
                        d="M10.5 5h3"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                    <span className="leading-tight">
                      <span className="block text-[0.6rem] uppercase tracking-[0.14em] text-orman-300">
                        Yakında
                      </span>
                      <span className="block text-sm font-medium text-krem-100">{magaza}</span>
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Telefon maketi — ayrı görsel dosyası gerektirmeden, CSS ile */}
          <div className="relative mx-auto hidden w-64 lg:block">
            <div className="rounded-[2.5rem] border-[6px] border-orman-900 bg-orman-900 shadow-kart-uzeri">
              <div className="relative overflow-hidden rounded-[2rem] bg-krem-50">
                <span
                  aria-hidden
                  className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-orman-900/60"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={api.medya(MAKET_GORSEL) ?? ''}
                  alt=""
                  aria-hidden
                  width={600}
                  height={800}
                  loading="lazy"
                  className="aspect-[3/4] w-full object-cover"
                />
                <div className="bg-krem-50 px-4 py-4">
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.16em] text-altin-600">
                    Tıkabasa Pilav
                  </p>
                  <p className="mt-1 text-sm font-medium text-orman-800">
                    Çin Usulü Tavuk &amp; Pilav
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-sm font-semibold text-orman-800">₺285,00</span>
                    <span
                      aria-hidden
                      className="flex size-8 items-center justify-center rounded-full bg-orman-800 text-krem-50"
                    >
                      <svg viewBox="0 0 16 16" className="size-3.5">
                        <path
                          d="M8 3v10M3 8h10"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
