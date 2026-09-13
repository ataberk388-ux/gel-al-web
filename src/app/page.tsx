import Link from 'next/link';
import { WEB_PATHS, type BrandRef } from '@gelal/shared';
import { api } from '@/lib/api';
import { SubeKarti } from '@/components/sube-karti';
import { KahramanGorsel } from '@/components/kahraman-gorsel';
import { MobilUygulama } from '@/components/mobil-uygulama';
import { Belirme } from '@/components/belirme';
import { MarkaSeridi } from '@/components/marka-seridi';
import { NasilCalisir } from '@/components/nasil-calisir';

const GUVEN_MADDELERI = [
  { baslik: 'Online ödeme', aciklama: '3D Secure ile güvenli' },
  { baslik: 'Tek sepet', aciklama: 'Aynı şubedeki tüm markalar' },
  { baslik: 'Şubeden teslim', aciklama: 'Hazır olunca haber veriyoruz' },
];

interface Props {
  searchParams: Promise<{ konum?: string }>;
}

export default async function AnaSayfa({ searchParams }: Props) {
  const { konum } = await searchParams;
  const subeler = await api.subeler(konum);

  // Şubelerdeki markalar birleştirilip tekilleştirilir — şerit tüm markaları
  // gösterir, hangi şubede olduğundan bağımsız.
  const markalar: BrandRef[] = [
    ...new Map(
      subeler.flatMap((sube) => sube.brands).map((marka) => [marka.id, marka]),
    ).values(),
  ];

  const toplamUrun = subeler.reduce((enFazla, sube) => Math.max(enFazla, sube.productCount), 0);

  // İki şube üç sütuna sığmıyor — sağda boş hücre kalıyor. Az sayıda şubede
  // kartlar geniş ekranda yatay düzene geçip satırı tam dolduruyor.
  const azSube = subeler.length > 0 && subeler.length <= 2;

  return (
    <>
      {/* ---------------- Kahraman ---------------- */}
      <section className="bg-gradient-to-b from-krem-100 to-krem-50">
        <div className="kabuk pb-16 pt-12 sm:pt-20">
          <div className="grid items-center gap-12 lg:grid-cols-2 xl:grid-cols-[0.95fr_1.05fr] xl:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-altin-600">
                Hürmet Gıda
              </p>

              <h1 className="mt-5 text-balance text-4xl font-semibold leading-[1.06] text-orman-800 sm:text-5xl xl:text-6xl">
                Aynı şubedeki farklı lezzetler, tek sepette.
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-orman-600 xl:text-lg">
                Pilavını, mezesini ve tatlını tek siparişte birleştir. Online öde, hazır olduğunda
                şubeden gel al.
              </p>

              {/* Arama — tek parça hap, düğme içeride */}
              <form
                action="/#subeler"
                method="get"
                className="mt-9 flex max-w-xl items-center gap-2 rounded-full border border-krem-300 bg-white p-2 shadow-kart-uzeri focus-within:border-orman-300"
              >
                <span aria-hidden className="pointer-events-none pl-3 text-orman-400">
                  <svg viewBox="0 0 24 24" fill="none" className="size-5">
                    <path
                      d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <input
                  type="search"
                  name="konum"
                  defaultValue={konum ?? ''}
                  placeholder="İlçe veya mahalle — örn. Pendik"
                  aria-label="İlçe veya mahalle ara"
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-orman-800 outline-none placeholder:text-orman-400"
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-orman-800 px-6 py-3 text-sm font-medium text-krem-50 transition hover:bg-orman-700"
                >
                  Şubeleri Göster
                </button>
              </form>

              <ul className="mt-9 flex flex-wrap gap-x-10 gap-y-4">
                {GUVEN_MADDELERI.map((madde) => (
                  <li key={madde.baslik} className="flex items-start gap-2.5">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-orman-100 text-orman-700"
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
                    <span>
                      <span className="block text-sm font-medium text-orman-800">
                        {madde.baslik}
                      </span>
                      <span className="block text-xs text-orman-500">{madde.aciklama}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Kahraman görseli — marka marka dönen imza yemekler */}
            <div className="relative">
              <KahramanGorsel />

              {/* Yüzen bilgi kartları — ürün derinliği ve marka sayısı */}
              <div className="absolute -bottom-2 -left-4 hidden rounded-2xl border border-krem-200 bg-white/95 px-6 py-4 shadow-kart-uzeri backdrop-blur sm:block">
                <p className="font-display text-3xl font-semibold leading-none text-orman-800">
                  {toplamUrun}
                </p>
                <p className="mt-1.5 text-xs text-orman-500">şubede satılan ürün</p>
              </div>

              <div className="absolute -top-5 -right-4 hidden rounded-2xl border border-krem-200 bg-white/95 px-5 py-3.5 shadow-kart-uzeri backdrop-blur lg:block">
                <p className="font-display text-2xl font-semibold leading-none text-altin-600">
                  {markalar.length}
                </p>
                <p className="mt-1 text-xs text-orman-500">marka, tek sepet</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <MarkaSeridi markalar={markalar} />

      {/* ---------------- Şubeler ---------------- */}
      <section id="subeler" className="kabuk mt-20 scroll-mt-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="altin-cizgi text-2xl font-semibold text-orman-800 sm:text-3xl">
              {konum ? `“${konum}” için şubeler` : 'Yakındaki şubeler'}
            </h2>
            <p className="mt-4 text-sm text-orman-500">
              Şubeni seç, o şubedeki tüm markaların menüsünü tek sayfada gör.
            </p>
          </div>
          {konum ? (
            <Link
              href={WEB_PATHS.subeler()}
              className="rounded-full border border-krem-300 bg-white px-4 py-2 text-sm font-medium text-orman-700 transition hover:border-orman-300"
            >
              Aramayı temizle
            </Link>
          ) : null}
        </div>

        {subeler.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-krem-300 bg-white/60 p-12 text-center text-orman-600">
            Bu aramaya uygun şube bulunamadı.{' '}
            <Link href={WEB_PATHS.subeler()} className="font-medium text-orman-800 underline">
              Tüm şubeleri gör
            </Link>
          </p>
        ) : (
          <ul
            className={`mt-10 grid gap-6 2xl:gap-8 ${
              azSube ? 'md:grid-cols-2' : 'md:grid-cols-2 xl:grid-cols-3'
            }`}
          >
            {subeler.map((sube, sira) => (
              <li key={sube.id} className="h-full">
                {/* Kademe: kartlar aynı anda değil, sırayla belirsin. */}
                <Belirme gecikme={sira * 90} className="h-full">
                  <SubeKarti sube={sube} genis={azSube} />
                </Belirme>
              </li>
            ))}
          </ul>
        )}
      </section>

      <NasilCalisir />

      <MobilUygulama />
    </>
  );
}
