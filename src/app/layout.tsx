import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Link from 'next/link';
import { WEB_PATHS } from '@gelal/shared';
import { api, sessizce } from '@/lib/api';
import { SepetSaglayici } from '@/lib/sepet';
import { GelAlLogo, HurmetKilit } from '@/components/marka';
import './globals.css';

/**
 * Fraunces başlıklarda, Inter gövdede. İkisi de `latin-ext` alt kümesini
 * taşıyor — ş, ğ, ı, İ, ç, ö, ü doğru render edilsin.
 */
const display = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--yazi-display',
  display: 'swap',
  axes: ['SOFT', 'WONK'],
});

const govde = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--yazi-govde',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Hürmet Gel Al',
    template: '%s · Hürmet Gel Al',
  },
  description:
    'Aynı şubedeki farklı lezzetler, tek sepette. Online ödeyin, siparişinizi şubeden teslim alın.',
};

/**
 * Tüm uygulama istek anında render edilir.
 *
 * Kök düzen işletme bilgisini ve sosyal medya bağlantılarını API'den okuyor;
 * statik ön-render bunu DERLEME anında çalıştırmaya kalkıyor. Bu hem CI'da
 * (API ayakta değil) derlemeyi kırıyor hem de menü/fiyat değişikliklerinin
 * yayına çıkması için yeniden derleme gerektiriyordu.
 */
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#173d2b',
};

const SOSYAL_ETIKET: Record<string, string> = {
  INSTAGRAM: 'Instagram',
  TIKTOK: 'TikTok',
  YOUTUBE: 'YouTube',
  THREADS: 'Threads',
  FACEBOOK: 'Facebook',
  X: 'X',
  LINKEDIN: 'LinkedIn',
};

const MENU_BAGLANTILARI = [
  { etiket: 'Ana Sayfa', adres: WEB_PATHS.anasayfa() },
  { etiket: 'Şubeler', adres: WEB_PATHS.subeler() },
  { etiket: 'Nasıl Çalışır?', adres: WEB_PATHS.nasilCalisir() },
];

/** Alt bilgideki yasal metinler — Faz 1 canlıya çıkış gereksinimi (plan 4.6). */
const YASAL_BAGLANTILAR = [
  'Mesafeli Satış Sözleşmesi',
  'Gizlilik ve KVKK Aydınlatma Metni',
  'İade ve İptal Koşulları',
  'Çerez Politikası',
];

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // `sessizce`: API'ye ulaşılamazsa alt bilgi varsayılan metinle çizilir.
  // İşletme adı ve sosyal medya bağlantıları sayfanın işlevi için kritik
  // değil; bu yüzden tüm siteyi hata sayfasına düşürmüyoruz.
  const isletme = await sessizce(() => api.isletme());

  return (
    <html lang="tr" className={`${display.variable} ${govde.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <SepetSaglayici>
          {/*
           * Başlık koyu yeşil: marka kimliğinin ana rengi bu ve logonun altın
           * detayları koyu zeminde parlıyor. Krem zeminde başlık, altındaki
           * krem kahraman bölümüyle birleşip kayboluyordu.
           */}
          <header className="sticky top-0 z-40 border-b border-orman-900/40 bg-orman-800/95 backdrop-blur">
            <div className="kabuk flex items-center gap-8 py-3">
              <Link href={WEB_PATHS.anasayfa()} aria-label="Hürmet Gel Al ana sayfa">
                <GelAlLogo ton="acik" />
              </Link>

              <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
                {MENU_BAGLANTILARI.map((bag) => (
                  <Link
                    key={bag.etiket}
                    href={bag.adres}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-krem-200 transition hover:bg-orman-700 hover:text-white"
                  >
                    {bag.etiket}
                  </Link>
                ))}
              </nav>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/isletme"
                  className="hidden rounded-full border border-orman-600 px-4 py-2 text-sm font-medium text-krem-200 transition hover:border-altin-400 hover:text-white sm:block"
                >
                  İşletme Girişi
                </Link>
                <Link
                  href={WEB_PATHS.siparislerim()}
                  className="rounded-full border border-orman-600 px-4 py-2 text-sm font-medium text-krem-200 transition hover:border-altin-400 hover:text-white"
                >
                  Siparişlerim
                </Link>
                <Link
                  href={WEB_PATHS.subeler()}
                  className="rounded-full bg-altin-400 px-5 py-2 text-sm font-semibold text-orman-900 transition hover:bg-altin-300"
                >
                  Sipariş Ver
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          {/*
           * Alt bilgi iki katmanlı: üstte marka kilidi ve bağlantılar, altta
           * yasal metinler ve künye. Önceki tek katmanlı hâli üç sütunluk
           * boşluğa yayılmış birkaç bağlantıdan ibaretti ve sayfanın sonu
           * "bitmiş" hissi vermiyordu.
           */}
          <footer className="bg-orman-900 text-krem-200">
            <div className="kabuk py-16">
              <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1.1fr] lg:gap-10">
                {/* Marka */}
                <div>
                  <HurmetKilit ton="acik" className="h-28 w-auto" />

                  <p className="mt-5 max-w-xs text-sm leading-relaxed text-orman-200">
                    {isletme?.description ??
                      'Aynı şubedeki farklı lezzetler, tek sepette. Siparişinizi verin, şubeden teslim alın.'}
                  </p>

                  <p className="mt-6 flex items-center gap-2 text-xs text-orman-300">
                    <span aria-hidden className="h-px w-6 bg-altin-400/60" />
                    Lezzete hürmet · İnsana hürmet
                  </p>
                </div>

                {/* Keşfet */}
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-altin-300">
                    Keşfet
                  </h2>
                  <ul className="mt-5 space-y-3 text-sm">
                    {MENU_BAGLANTILARI.map((bag) => (
                      <li key={bag.etiket}>
                        <Link href={bag.adres} className="transition hover:text-white">
                          {bag.etiket}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href={WEB_PATHS.siparislerim()} className="transition hover:text-white">
                        Siparişlerim
                      </Link>
                    </li>
                    <li>
                      <Link href="/isletme" className="transition hover:text-white">
                        İşletme Girişi
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Yasal — Faz 1 canlıya çıkış gereksinimi (plan 4.6) */}
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-altin-300">
                    Bilgilendirme
                  </h2>
                  <ul className="mt-5 space-y-3 text-sm">
                    {YASAL_BAGLANTILAR.map((metin) => (
                      <li key={metin}>
                        {/*
                         * Metinler hazırlanmadı; bağlantı yerine edilgen
                         * gösteriliyor. Tıklanıp boş sayfaya düşen bir yasal
                         * bağlantı, olmayan bağlantıdan daha kötü.
                         */}
                        <span className="cursor-not-allowed text-orman-300" title="Yakında">
                          {metin}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* İletişim ve sosyal */}
                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-altin-300">
                    Bizi takip edin
                  </h2>

                  {isletme && isletme.socialLinks.length > 0 ? (
                    <ul className="mt-5 flex flex-wrap gap-2">
                      {isletme.socialLinks.map((link) => (
                        <li key={link.platform}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex rounded-full border border-orman-700 px-3.5 py-2 text-xs font-medium transition hover:border-altin-400 hover:text-white"
                          >
                            {SOSYAL_ETIKET[link.platform] ?? link.platform}
                          </a>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-5 text-sm text-orman-300">Yakında.</p>
                  )}

                  <div className="mt-8 rounded-xl border border-orman-700 bg-orman-800/60 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-altin-300">
                      Gel-Al hizmeti
                    </p>
                    <p className="mt-2 text-xs leading-relaxed text-orman-200">
                      Siparişiniz şubeden teslim alınır. Adrese teslimat ve kurye hizmeti
                      bulunmamaktadır.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-orman-800">
              <div className="kabuk flex flex-wrap items-center justify-between gap-3 py-5 text-xs text-orman-300">
                <p>
                  © {new Date().getFullYear()} {isletme?.name ?? 'Hürmet Gıda'} Tic. A.Ş. Tüm
                  hakları saklıdır.
                </p>
                <p>Ödemeler 3D Secure ile lisanslı ödeme kuruluşu altyapısında alınır.</p>
              </div>
            </div>
          </footer>
        </SepetSaglayici>
      </body>
    </html>
  );
}
