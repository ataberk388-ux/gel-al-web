import Link from 'next/link';
import { WEB_PATHS } from '@gelal/shared';
import { api } from '@/lib/api';
import { MarkaRozeti } from '@/components/marka-rozeti';

/** Kahraman görseli: menüdeki imza yemeklerden biri. */
const KAHRAMAN_GORSEL = 'products/tikabasa-pilav-tikabasa-double-tavuklu-pilav.webp';

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

  return (
    <>
      {/* ---------------- Kahraman ---------------- */}
      <section className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 sm:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-14">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-altin-600">
              Hürmet Gıda
            </p>

            <h1 className="mt-4 text-balance text-4xl leading-[1.08] font-semibold text-orman-800 sm:text-5xl lg:text-[3.4rem]">
              Aynı şubedeki farklı lezzetler, tek sepette.
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-orman-600">
              Pilavını, mezesini ve tatlını tek siparişte birleştir. Online öde, hazır olduğunda
              şubeden gel al.
            </p>

            <form
              action="/#subeler"
              method="get"
              className="mt-8 flex max-w-md flex-col gap-2 sm:flex-row"
            >
              <div className="relative flex-1">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-orman-400"
                >
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
                  className="w-full rounded-full border border-krem-300 bg-white py-3.5 pl-12 pr-4 text-sm text-orman-800 shadow-kart transition placeholder:text-orman-400 focus:border-orman-400"
                />
              </div>
              <button
                type="submit"
                className="rounded-full bg-orman-800 px-7 py-3.5 text-sm font-medium text-krem-50 transition hover:bg-orman-700"
              >
                Şubeleri Göster
              </button>
            </form>

            <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
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

          {/* Kahraman görseli */}
          <div className="relative">
            <div className="overflow-hidden rounded-[1.75rem] bg-krem-200 shadow-kart-uzeri">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={api.medya(KAHRAMAN_GORSEL) ?? ''}
                alt="Hürmet Gıda tabağı"
                width={900}
                height={720}
                className="aspect-[5/4] w-full object-cover"
              />
            </div>

            {/* Yüzen bilgi kartı — ürün derinliğini gösterir */}
            <div className="absolute -bottom-5 left-5 hidden rounded-2xl border border-krem-200 bg-white/95 px-5 py-3.5 shadow-kart-uzeri backdrop-blur sm:block">
              <p className="font-display text-2xl font-semibold leading-none text-orman-800">
                {subeler.reduce((toplam, sube) => Math.max(toplam, sube.productCount), 0)}
              </p>
              <p className="mt-1 text-xs text-orman-500">şubede satılan ürün</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- Şubeler ---------------- */}
      <section id="subeler" className="mx-auto max-w-6xl scroll-mt-24 px-4 pt-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-orman-800 sm:text-3xl">
              {konum ? `“${konum}” için şubeler` : 'Yakındaki şubeler'}
            </h2>
            <p className="mt-2 text-sm text-orman-500">
              Şubeni seç, o şubedeki tüm markaların menüsünü tek sayfada gör.
            </p>
          </div>
          {konum ? (
            <Link
              href="/#subeler"
              className="rounded-full border border-krem-300 px-4 py-2 text-sm font-medium text-orman-700 transition hover:bg-white"
            >
              Aramayı temizle
            </Link>
          ) : null}
        </div>

        {subeler.length === 0 ? (
          <p className="mt-10 rounded-2xl border border-dashed border-krem-300 bg-white/60 p-10 text-center text-orman-600">
            Bu aramaya uygun şube bulunamadı.{' '}
            <Link href="/#subeler" className="font-medium text-orman-800 underline">
              Tüm şubeleri gör
            </Link>
          </p>
        ) : (
          <ul className="mt-8 grid gap-6 md:grid-cols-2">
            {subeler.map((sube) => {
              const kapak = api.medya(sube.coverPath);
              return (
                <li key={sube.id}>
                  <Link
                    href={WEB_PATHS.sube(sube.slug)}
                    className="group flex h-full gap-5 rounded-2xl border border-krem-200 bg-white p-4 shadow-kart transition hover:border-orman-200 hover:shadow-kart-uzeri"
                  >
                    <div className="relative w-32 shrink-0 overflow-hidden rounded-xl bg-krem-200 sm:w-36">
                      {kapak ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={kapak}
                          alt=""
                          width={288}
                          height={384}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]"
                        />
                      ) : null}
                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orman-900/85 to-transparent px-2.5 pb-2 pt-6 text-[0.6rem] font-semibold uppercase tracking-[0.14em] text-krem-100">
                        Hürmet Gıda
                      </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <h3 className="text-lg font-semibold leading-snug text-orman-800">
                        {sube.name}
                      </h3>
                      <p className="mt-1 text-sm text-orman-500">
                        {sube.addressLine} · {sube.district}
                      </p>

                      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                        <span className="inline-flex items-center gap-1.5">
                          <span
                            aria-hidden
                            className={`size-2 rounded-full ${
                              sube.isOpen ? 'bg-orman-500' : 'bg-krem-400'
                            }`}
                          />
                          <span
                            className={sube.isOpen ? 'text-orman-700' : 'text-orman-500'}
                          >
                            {sube.isOpen ? 'Açık' : 'Kapalı'}
                          </span>
                        </span>
                        <span className="text-orman-500">~{sube.prepMinutes} dk</span>
                        <span className="text-orman-500">{sube.productCount} ürün</span>
                      </div>

                      <ul className="mt-3 flex flex-wrap gap-1.5">
                        {sube.brands.slice(0, 4).map((marka) => (
                          <li key={marka.id}>
                            <MarkaRozeti ad={marka.name} renk={marka.colorHex} />
                          </li>
                        ))}
                        {sube.brands.length > 4 ? (
                          <li className="self-center text-xs text-orman-500">
                            +{sube.brands.length - 4}
                          </li>
                        ) : null}
                      </ul>

                      <span className="mt-auto pt-4 text-sm font-medium text-orman-700 group-hover:text-orman-800">
                        Şubeyi gör →
                      </span>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ---------------- Nasıl çalışır ---------------- */}
      <section id="nasil-calisir" className="mt-24 scroll-mt-24 border-y border-krem-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="text-2xl font-semibold text-orman-800 sm:text-3xl">Nasıl çalışır?</h2>
          <ol className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Şubeni seç', 'Sana en yakın Hürmet Gıda şubesini bul, açık mı hemen gör.'],
              ['Sepetini kur', 'Aynı şubedeki farklı markaların ürünlerini tek sepette birleştir.'],
              ['Online öde', 'Ödemeni 3D Secure ile güvenle tamamla.'],
              ['Gel al', 'Siparişin hazır olunca haber veriyoruz; kodunla şubeden teslim al.'],
            ].map(([baslik, aciklama], sira) => (
              <li key={baslik} className="relative">
                <span className="font-display text-5xl font-semibold leading-none text-krem-300">
                  {String(sira + 1).padStart(2, '0')}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-orman-800">{baslik}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-orman-600">{aciklama}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  );
}
