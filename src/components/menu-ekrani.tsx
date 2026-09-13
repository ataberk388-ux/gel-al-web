'use client';

/**
 * Şube menüsü + ortak sepet.
 *
 * Plan 4.1'in üç kuralı burada görünür hale geliyor:
 *   • Aynı şubedeki farklı markalardan ortak sepet
 *   • Sepette ürünlerin markalara göre gruplanması
 *   • Şube değişikliğinde sepet uyarısı ve kontrollü temizleme
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  formatMinor,
  type BranchDetail,
  type BrandMenu,
  type MenuProduct,
} from '@gelal/shared';
import { api } from '@/lib/api';
import { useSepet, satirToplami, type SepetSatiri } from '@/lib/sepet';
import { MarkaRozeti } from '@/components/marka-rozeti';
import { baslikYap } from '@/lib/metin';

function gorselUrl(yol: string | null): string | null {
  return api.medya(yol);
}

export function MenuEkrani({ sube }: { sube: BranchDetail }) {
  const [aktifMarkaId, setAktifMarkaId] = useState(sube.menu[0]?.id ?? '');
  const [aktifKategoriId, setAktifKategoriId] = useState<string | null>(null);
  const [uyari, setUyari] = useState<{ mevcutSube: string } | null>(null);
  const [sepetAcik, setSepetAcik] = useState(false);
  const [sonEklenen, setSonEklenen] = useState<string | null>(null);

  const sepet = useSepet();
  const marka = useMemo(
    () => sube.menu.find((m) => m.id === aktifMarkaId) ?? sube.menu[0],
    [sube.menu, aktifMarkaId],
  );

  // Marka değişince kategori seçimi sıfırlanır.
  useEffect(() => {
    setAktifKategoriId(null);
  }, [aktifMarkaId]);

  const gosterilenKategoriler = useMemo(() => {
    if (!marka) return [];
    return aktifKategoriId
      ? marka.categories.filter((k) => k.id === aktifKategoriId)
      : marka.categories;
  }, [marka, aktifKategoriId]);

  function urunEkle(urun: MenuProduct, m: BrandMenu) {
    // Zorunlu seçenek grubu varsa varsayılanı (yoksa ilkini) seçiyoruz.
    const secenekler = urun.optionGroups
      .filter((grup) => grup.isRequired)
      .map((grup) => grup.options.find((o) => o.isDefault) ?? grup.options[0])
      .filter((o): o is NonNullable<typeof o> => Boolean(o))
      .map((o) => ({ id: o.id, ad: o.name, farkMinor: o.priceDeltaMinor }));

    const satir: Omit<SepetSatiri, 'adet'> = {
      urunId: urun.id,
      urunAdi: urun.name,
      markaId: m.id,
      markaAdi: m.name,
      markaRengi: m.colorHex,
      birimFiyatMinor: urun.priceMinor,
      gorselYolu: urun.thumbnailPath ?? urun.imagePath,
      secenekler,
    };

    const sonuc = sepet.ekle({ id: sube.id, ad: sube.name, slug: sube.slug }, satir);
    if (sonuc.durum === 'subeDegisikligi') {
      setUyari({ mevcutSube: sonuc.mevcutSube });
      return;
    }
    setSonEklenen(urun.id);
    window.setTimeout(() => setSonEklenen((mevcut) => (mevcut === urun.id ? null : mevcut)), 1200);
  }

  return (
    <>
      {/* ---------------- Şube başlığı ---------------- */}
      <div className="border-b border-krem-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Link
            href="/#subeler"
            className="text-sm font-medium text-orman-600 transition hover:text-orman-800"
          >
            ← Tüm şubeler
          </Link>

          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-altin-600">
                Hürmet Gıda
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-orman-800 sm:text-4xl">
                {sube.name}
              </h1>
              <p className="mt-2 text-sm text-orman-500">
                {sube.addressLine} · {sube.district}/{sube.city}
              </p>
            </div>

            <div className="flex items-center gap-4 text-sm">
              <span className="inline-flex items-center gap-2">
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${sube.isOpen ? 'bg-orman-500' : 'bg-krem-400'}`}
                />
                <span className={sube.isOpen ? 'text-orman-700' : 'text-orman-500'}>
                  {sube.isOpen ? 'Siparişe açık' : 'Şu an kapalı'}
                </span>
              </span>
              <span className="text-orman-500">~{sube.prepMinutes} dk hazırlanma</span>
            </div>
          </div>

          {/* Marka sekmeleri */}
          <div className="serit -mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
            {sube.menu.map((m) => {
              const aktif = m.id === marka?.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAktifMarkaId(m.id)}
                  aria-pressed={aktif}
                  className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
                    aktif
                      ? 'border-transparent text-white'
                      : 'border-krem-300 bg-white text-orman-700 hover:border-orman-300'
                  }`}
                  style={aktif ? { backgroundColor: m.colorHex ?? '#1f4a34' } : undefined}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[1fr_22rem]">
          {/* ---------------- Menü ---------------- */}
          <div>
            {/* Kategori filtresi */}
            {marka && marka.categories.length > 1 ? (
              <div className="serit -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0">
                <button
                  type="button"
                  onClick={() => setAktifKategoriId(null)}
                  aria-pressed={aktifKategoriId === null}
                  className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
                    aktifKategoriId === null
                      ? 'bg-orman-800 text-krem-50'
                      : 'bg-white text-orman-600 hover:text-orman-800'
                  }`}
                >
                  Tümü
                </button>
                {marka.categories.map((kategori) => (
                  <button
                    key={kategori.id}
                    type="button"
                    onClick={() => setAktifKategoriId(kategori.id)}
                    aria-pressed={aktifKategoriId === kategori.id}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-sm transition ${
                      aktifKategoriId === kategori.id
                        ? 'bg-orman-800 text-krem-50'
                        : 'bg-white text-orman-600 hover:text-orman-800'
                    }`}
                  >
                    {baslikYap(kategori.name)}
                  </button>
                ))}
              </div>
            ) : null}

            {gosterilenKategoriler.map((kategori) => (
              <section key={kategori.id} className="mb-12">
                <h2 className="text-xl font-semibold text-orman-800">
                  {baslikYap(kategori.name)}
                </h2>
                <p className="mt-1 text-sm text-orman-500">{kategori.products.length} ürün</p>

                <ul className="mt-5 grid gap-4 sm:grid-cols-2">
                  {kategori.products.map((urun) => {
                    const gorsel = gorselUrl(urun.thumbnailPath ?? urun.imagePath);
                    const eklendi = sonEklenen === urun.id;
                    return (
                      <li
                        key={urun.id}
                        className="group flex gap-4 rounded-2xl border border-krem-200 bg-white p-3 shadow-kart transition hover:border-orman-200 hover:shadow-kart-uzeri"
                      >
                        <div className="size-24 shrink-0 overflow-hidden rounded-xl bg-krem-200">
                          {gorsel ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={gorsel}
                              alt=""
                              width={192}
                              height={192}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]"
                            />
                          ) : (
                            <span
                              aria-hidden
                              className="flex h-full w-full items-center justify-center text-2xl text-krem-400"
                            >
                              🍽
                            </span>
                          )}
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col">
                          <p className="font-medium leading-snug text-orman-800">{urun.name}</p>
                          <p className="mt-1 text-xs text-orman-500">
                            {[urun.portionLabel, urun.optionGroups[0]?.name]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>

                          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                            <span className="font-semibold tabular-nums text-orman-800">
                              {formatMinor(urun.priceMinor)}
                            </span>
                            <button
                              type="button"
                              disabled={!urun.isAvailable || !sube.isOpen}
                              onClick={() => marka && urunEkle(urun, marka)}
                              className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition disabled:cursor-not-allowed disabled:bg-krem-200 disabled:text-orman-400 ${
                                eklendi
                                  ? 'bg-orman-500 text-white'
                                  : 'bg-orman-800 text-krem-50 hover:bg-orman-700'
                              }`}
                            >
                              {!urun.isAvailable ? 'Tükendi' : eklendi ? 'Eklendi ✓' : 'Ekle'}
                            </button>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </section>
            ))}
          </div>

          {/* ---------------- Sepet ---------------- */}
          <aside
            className={`lg:sticky lg:top-24 lg:self-start ${sepetAcik ? '' : 'hidden lg:block'}`}
          >
            <div className="rounded-2xl border border-krem-200 bg-white shadow-kart">
              <div className="flex items-center justify-between border-b border-krem-200 px-5 py-4">
                <h2 className="font-semibold text-orman-800">Sepetim</h2>
                {sepet.toplamAdet > 0 ? (
                  <button
                    type="button"
                    onClick={sepet.temizle}
                    className="text-xs text-orman-500 transition hover:text-orman-800"
                  >
                    Temizle
                  </button>
                ) : null}
              </div>

              {sepet.toplamAdet === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-3xl" aria-hidden>
                    🧺
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-orman-600">
                    Sepetin boş. Aynı şubedeki farklı markalardan ürünleri tek sepette
                    birleştirebilirsin.
                  </p>
                </div>
              ) : (
                <>
                  <p className="px-5 pt-3 text-xs text-orman-500">{sepet.durum.subeAdi}</p>

                  <div className="max-h-[26rem] space-y-5 overflow-y-auto px-5 py-4">
                    {sepet.markaGruplari.map((grup) => (
                      <div key={grup.markaId}>
                        <MarkaRozeti ad={grup.markaAdi} renk={grup.markaRengi} />
                        <ul className="mt-2.5 space-y-3">
                          {grup.satirlar.map((satir) => {
                            const anahtar = sepet.anahtarla(satir);
                            return (
                              <li key={anahtar} className="flex items-start gap-2 text-sm">
                                <div className="min-w-0 flex-1">
                                  <p className="leading-snug text-orman-800">{satir.urunAdi}</p>
                                  {satir.secenekler.length > 0 ? (
                                    <p className="mt-0.5 text-xs text-orman-500">
                                      {satir.secenekler.map((s) => s.ad).join(', ')}
                                    </p>
                                  ) : null}
                                  <div className="mt-1.5 flex items-center gap-1">
                                    <button
                                      type="button"
                                      aria-label={`${satir.urunAdi} adedini azalt`}
                                      onClick={() => sepet.adetDegistir(anahtar, satir.adet - 1)}
                                      className="size-6 rounded-md border border-krem-300 text-orman-700 transition hover:bg-krem-100"
                                    >
                                      −
                                    </button>
                                    <span className="w-6 text-center tabular-nums">
                                      {satir.adet}
                                    </span>
                                    <button
                                      type="button"
                                      aria-label={`${satir.urunAdi} adedini artır`}
                                      onClick={() => sepet.adetDegistir(anahtar, satir.adet + 1)}
                                      className="size-6 rounded-md border border-krem-300 text-orman-700 transition hover:bg-krem-100"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                                <span className="shrink-0 pt-0.5 font-medium tabular-nums text-orman-800">
                                  {formatMinor(satirToplami(satir))}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-krem-200 px-5 py-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-orman-500">
                        {sepet.toplamAdet} ürün · {sepet.markaGruplari.length} marka
                      </span>
                      <span className="text-xl font-semibold tabular-nums text-orman-800">
                        {formatMinor(sepet.toplamMinor)}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled
                      title="Ödeme adımı henüz bağlanmadı"
                      className="mt-3 w-full rounded-full bg-orman-800 py-3 font-medium text-krem-50 transition hover:bg-orman-700 disabled:cursor-not-allowed disabled:bg-krem-200 disabled:text-orman-400"
                    >
                      Ödemeye Geç
                    </button>
                    <p className="mt-2.5 text-center text-xs text-orman-500">
                      Siparişini {sube.name}&apos;nden teslim alacaksın.
                    </p>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </div>

      {/* Mobil sepet çubuğu */}
      {sepet.toplamAdet > 0 ? (
        <button
          type="button"
          onClick={() => setSepetAcik((acik) => !acik)}
          className="fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-full bg-orman-800 px-6 py-4 text-krem-50 shadow-kart-uzeri lg:hidden"
        >
          <span className="text-sm font-medium">
            {sepetAcik ? 'Sepeti gizle' : `Sepeti gör · ${sepet.toplamAdet} ürün`}
          </span>
          <span className="font-semibold tabular-nums">{formatMinor(sepet.toplamMinor)}</span>
        </button>
      ) : null}

      {/* Şube değişikliği uyarısı — plan 4.1 "kontrollü temizleme" */}
      {uyari ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sube-uyari-baslik"
          className="fixed inset-0 z-50 flex items-center justify-center bg-orman-900/50 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-kart-uzeri">
            <h2 id="sube-uyari-baslik" className="text-lg font-semibold text-orman-800">
              Sepetin başka bir şubede
            </h2>
            <p className="mt-2.5 text-sm leading-relaxed text-orman-600">
              Sepetinde <strong className="text-orman-800">{uyari.mevcutSube}</strong> siparişi
              var. Bir sepet yalnızca tek şubeye ait olabilir.{' '}
              <strong className="text-orman-800">{sube.name}</strong> ile devam edersen mevcut
              sepetin silinecek.
            </p>
            <div className="mt-6 flex gap-2">
              <button
                type="button"
                onClick={() => setUyari(null)}
                className="flex-1 rounded-full border border-krem-300 py-2.5 text-sm font-medium text-orman-700 transition hover:bg-krem-100"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={() => {
                  sepet.temizle();
                  setUyari(null);
                }}
                className="flex-1 rounded-full bg-orman-800 py-2.5 text-sm font-medium text-krem-50 transition hover:bg-orman-700"
              >
                Sepeti boşalt
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
