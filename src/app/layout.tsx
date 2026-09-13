import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter } from 'next/font/google';
import Link from 'next/link';
import { WEB_PATHS } from '@gelal/shared';
import { api, sessizce } from '@/lib/api';
import { SepetSaglayici } from '@/lib/sepet';
import { GelAlLogo, HurmetIsaret } from '@/components/marka';
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
    default: 'Gel Al — Hürmet Gıda',
    template: '%s · Gel Al',
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
 *
 * Önbellekleme stratejisi belirlendiğinde sayfa bazında `revalidate` ile
 * gevşetilebilir.
 */
export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#fbf9f4',
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // `sessizce`: API'ye ulaşılamazsa alt bilgi varsayılan metinle çizilir.
  // İşletme adı ve sosyal medya bağlantıları sayfanın işlevi için kritik
  // değil; bu yüzden tüm siteyi hata sayfasına düşürmüyoruz.
  const isletme = await sessizce(() => api.isletme());

  return (
    <html lang="tr" className={`${display.variable} ${govde.variable}`}>
      <body className="flex min-h-dvh flex-col font-sans">
        <SepetSaglayici>
          <header className="sticky top-0 z-40 border-b border-krem-200/80 bg-krem-50/85 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center gap-8 px-4 py-3.5 sm:px-6">
              <Link href="/" aria-label="Gel Al ana sayfa">
                <GelAlLogo />
              </Link>

              <nav className="hidden items-center gap-1 lg:flex" aria-label="Ana menü">
                {MENU_BAGLANTILARI.map((bag) => (
                  <Link
                    key={bag.etiket}
                    href={bag.adres}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-orman-600 transition hover:bg-orman-50 hover:text-orman-800"
                  >
                    {bag.etiket}
                  </Link>
                ))}
              </nav>

              <div className="ml-auto flex items-center gap-2">
                <Link
                  href="/isletme"
                  className="hidden rounded-full border border-krem-300 px-4 py-2 text-sm font-medium text-orman-700 transition hover:border-orman-300 hover:bg-white sm:block"
                >
                  İşletme Girişi
                </Link>
                <Link
                  href="/siparislerim"
                  className="rounded-full border border-krem-300 px-4 py-2 text-sm font-medium text-orman-700 transition hover:border-orman-300 hover:bg-white"
                >
                  Siparişlerim
                </Link>
                <Link
                  href="/#subeler"
                  className="rounded-full bg-orman-800 px-4 py-2 text-sm font-medium text-krem-50 transition hover:bg-orman-700"
                >
                  Sipariş Ver
                </Link>
              </div>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-24 bg-orman-800 text-krem-200">
            <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
              <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
                <div>
                  <GelAlLogo ton="acik" />
                  <p className="mt-4 max-w-sm text-sm leading-relaxed text-krem-300">
                    {isletme?.description ??
                      'Aynı şubedeki farklı lezzetler, tek sepette. Siparişinizi verin, şubeden teslim alın.'}
                  </p>
                  <p className="mt-6 text-xs text-orman-300">
                    <HurmetIsaret className="text-krem-300" /> tarafından işletilmektedir.
                  </p>
                </div>

                <div>
                  <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-orman-300">
                    Keşfet
                  </h2>
                  <ul className="mt-4 space-y-2.5 text-sm">
                    {MENU_BAGLANTILARI.map((bag) => (
                      <li key={bag.etiket}>
                        <Link href={bag.adres} className="transition hover:text-white">
                          {bag.etiket}
                        </Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/siparislerim" className="transition hover:text-white">
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

                {isletme && isletme.socialLinks.length > 0 ? (
                  <div>
                    <h2 className="font-sans text-xs font-semibold uppercase tracking-widest text-orman-300">
                      Bizi takip edin
                    </h2>
                    <ul className="mt-4 space-y-2.5 text-sm">
                      {isletme.socialLinks.map((link) => (
                        <li key={link.platform}>
                          <a
                            href={link.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="transition hover:text-white"
                          >
                            {SOSYAL_ETIKET[link.platform] ?? link.platform}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <p className="mt-12 border-t border-orman-700 pt-6 text-xs leading-relaxed text-orman-300">
                Gel-Al hizmetinde siparişiniz şubeden teslim alınır; adrese teslimat ve kurye
                hizmeti bulunmamaktadır.
              </p>
            </div>
          </footer>
        </SepetSaglayici>
      </body>
    </html>
  );
}
