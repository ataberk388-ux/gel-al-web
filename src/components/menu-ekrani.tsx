'use client';

/**
 * Şube menüsü + ortak sepet.
 *
 * Plan 4.1'in üç kuralı burada görünür hale geliyor:
 *   • Aynı şubedeki farklı markalardan ortak sepet
 *   • Sepette ürünlerin markalara göre gruplanması
 *   • Şube değişikliğinde sepet uyarısı ve kontrollü temizleme
 *
 * Düzen geniş ekranda üç sütun — küresel sipariş sitelerinin restoran
 * sayfasıyla aynı mantık:
 *
 *     [ kategoriler ]   [ ürünler ]   [ sepet ]
 *
 * Sekiz markanın 462 ürünü var; kategori listesi sabit dururken müşteri
 * menüde kayboluyordu. Sepet de alttan bir çubuktu — sipariş büyüdükçe ne
 * eklediğini görmek için açıp kapatmak gerekiyordu.
 */

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  formatMinor,
  WEB_PATHS,
  type BranchDetail,
  type BrandMenu,
  type MenuProduct,
} from '@gelal/shared';
import { useSepet, satirToplami, type SepetSatiri } from '@/lib/sepet';
import { MarkaRozeti } from '@/components/marka-rozeti';
import { UrunKarti } from '@/components/urun-karti';
import { baslikYap } from '@/lib/metin';

export function MenuEkrani({ sube }: { sube: BranchDetail }) {
  const [aktifMarkaId, setAktifMarkaId] = useState(sube.menu[0]?.id ?? '');
  const [aktifKategoriId, setAktifKategoriId] = useState<string | null>(null);
  const [uyari, setUyari] = useState<{ mevcutSube: string } | null>(null);
  const [sepetAcik, setSepetAcik] = useState(false);

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

  /**
   * Ürün → sepetteki toplam adet.
   *
   * Aynı ürün farklı seçeneklerle birden çok satır olabilir; kartta toplamı
   * gösteriyoruz. Müşterinin sorduğu soru "bundan kaç tane aldım", "hangi
   * seçenekle kaç tane" değil — o ayrıntı sepet panelinde duruyor.
   */
  const adetHaritasi = useMemo(() => {
    const harita = new Map<string, number>();
    for (const satir of sepet.durum.satirlar) {
      harita.set(satir.urunId, (harita.get(satir.urunId) ?? 0) + satir.adet);
    }
    return harita;
  }, [sepet.durum.satirlar]);

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
    }
  }

  /** Karttaki eksi düğmesi — o ürünün en son eklenen satırından bir tane düşer. */
  function urunAzalt(urunId: string) {
    const satir = [...sepet.durum.satirlar].reverse().find((s) => s.urunId === urunId);
    if (!satir) return;
    sepet.adetDegistir(sepet.anahtarla(satir), satir.adet - 1);
  }

  return (
    <>
      {/* ---------------- Şube başlığı ---------------- */}
      <div className="border-b border-krem-200 bg-white">
        <div className="kabuk py-8">
          <Link
            href={WEB_PATHS.subeler()}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-orman-600 transition hover:text-orman-800"
          >
            <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4">
              <path
                d="M13 8H4m0 0 3.5-3.5M4 8l3.5 3.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Tüm şubeler
          </Link>

          <div className="mt-5 flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-altin-600">
                Hürmet Gıda
              </p>
              <h1 className="mt-2 text-3xl font-semibold text-orman-800 sm:text-4xl xl:text-5xl">
                {sube.name}
              </h1>
              <p className="mt-2.5 text-sm text-orman-500">
                {sube.addressLine} · {sube.district}/{sube.city}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-sm">
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-medium ${
                  sube.isOpen ? 'bg-orman-50 text-orman-700' : 'bg-krem-200 text-orman-500'
                }`}
              >
                <span
                  aria-hidden
                  className={`size-2 rounded-full ${sube.isOpen ? 'bg-orman-500' : 'bg-krem-400'}`}
                />
                {sube.isOpen ? 'Siparişe açık' : 'Şu an kapalı'}
              </span>
              <span className="rounded-full bg-krem-100 px-3.5 py-2 text-orman-600">
                ~{sube.prepMinutes} dk hazırlanma
              </span>
              <span className="rounded-full bg-krem-100 px-3.5 py-2 text-orman-600">
                {sube.menu.length} marka
              </span>
            </div>
          </div>

          {/* Marka sekmeleri */}
          <div className="serit -mx-4 mt-7 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0 lg:flex-wrap lg:overflow-visible">
            {sube.menu.map((m) => {
              const aktif = m.id === marka?.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setAktifMarkaId(m.id)}
                  aria-pressed={aktif}
                  className={`shrink-0 rounded-full border px-4 py-2.5 text-sm font-medium transition duration-200 ${
                    aktif
                      ? 'border-transparent text-white shadow-kart'
                      : 'border-krem-300 bg-white text-orman-700 hover:-translate-y-0.5 hover:border-orman-300'
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

      <div className="kabuk py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_21rem] xl:grid-cols-[14rem_1fr_23rem] xl:gap-10">
          {/* ---------------- Kategoriler (geniş ekran) ---------------- */}
          <aside className="hidden xl:block">
            <nav aria-label="Kategoriler" className="sticky top-28">
              <p className="px-3 text-xs font-semibold uppercase tracking-[0.16em] text-orman-400">
                Kategoriler
              </p>
              <ul className="mt-3 space-y-0.5">
                <li>
                  <button
                    type="button"
                    onClick={() => setAktifKategoriId(null)}
                    aria-pressed={aktifKategoriId === null}
                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                      aktifKategoriId === null
                        ? 'bg-orman-800 font-medium text-krem-50'
                        : 'text-orman-600 hover:bg-white hover:text-orman-800'
                    }`}
                  >
                    <span>Tümü</span>
                    <span className="text-xs tabular-nums opacity-70">
                      {marka?.categories.reduce((t, k) => t + k.products.length, 0) ?? 0}
                    </span>
                  </button>
                </li>
                {marka?.categories.map((kategori) => {
                  const aktif = aktifKategoriId === kategori.id;
                  return (
                    <li key={kategori.id}>
                      <button
                        type="button"
                        onClick={() => setAktifKategoriId(kategori.id)}
                        aria-pressed={aktif}
                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-sm transition ${
                          aktif
                            ? 'bg-orman-800 font-medium text-krem-50'
                            : 'text-orman-600 hover:bg-white hover:text-orman-800'
                        }`}
                      >
                        <span className="min-w-0 truncate">{baslikYap(kategori.name)}</span>
                        <span className="shrink-0 text-xs tabular-nums opacity-70">
                          {kategori.products.length}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          {/* ---------------- Ürünler ---------------- */}
          <div className="min-w-0">
            {/* Kategori şeridi — kenar çubuğunun görünmediği genişliklerde */}
            {marka && marka.categories.length > 1 ? (
              <div className="serit -mx-4 mb-8 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:px-0 xl:hidden">
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
              <section key={kategori.id} className="mb-14 scroll-mt-28">
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="text-xl font-semibold text-orman-800 xl:text-2xl">
                    {baslikYap(kategori.name)}
                  </h2>
                  <span className="shrink-0 text-sm text-orman-400">
                    {kategori.products.length} ürün
                  </span>
                </div>
                <div aria-hidden className="mt-3 h-px w-10 rounded-full bg-altin-400" />

                <ul className="mt-6 grid gap-5 sm:grid-cols-2 2xl:grid-cols-3">
                  {kategori.products.map((urun) => (
                    <li key={urun.id} className="h-full">
                      <UrunKarti
                        urun={urun}
                        subeAcik={sube.isOpen}
                        adet={adetHaritasi.get(urun.id) ?? 0}
                        onEkle={() => marka && urunEkle(urun, marka)}
                        onAzalt={() => urunAzalt(urun.id)}
                      />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          {/* ---------------- Sepet ---------------- */}
          <aside
            className={`lg:sticky lg:top-28 lg:self-start ${sepetAcik ? '' : 'hidden lg:block'}`}
          >
            <div className="overflow-hidden rounded-2xl border border-krem-200 bg-white shadow-kart">
              <div className="flex items-center justify-between gap-2 border-b border-krem-200 px-5 py-4">
                <h2 className="flex items-center gap-2 font-semibold text-orman-800">
                  Sepetim
                  {sepet.toplamAdet > 0 ? (
                    <span className="rounded-full bg-altin-300/20 px-2 py-0.5 text-xs font-semibold tabular-nums text-altin-600">
                      {sepet.toplamAdet}
                    </span>
                  ) : null}
                </h2>
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
                <div className="px-6 py-12 text-center">
                  <span
                    aria-hidden
                    className="mx-auto flex size-14 items-center justify-center rounded-full bg-krem-100 text-2xl"
                  >
                    🧺
                  </span>
                  <p className="mt-4 text-sm leading-relaxed text-orman-600">
                    Sepetin boş. Aynı şubedeki farklı markalardan ürünleri tek sepette
                    birleştirebilirsin.
                  </p>
                </div>
              ) : (
                <>
                  <p className="flex items-center gap-1.5 border-b border-krem-100 px-5 py-2.5 text-xs text-orman-500">
                    <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-3.5">
                      <path
                        d="M8 14s4.5-3.8 4.5-7.3A4.5 4.5 0 0 0 3.5 6.7C3.5 10.2 8 14 8 14Z"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      />
                      <circle cx="8" cy="6.6" r="1.6" stroke="currentColor" strokeWidth="1.2" />
                    </svg>
                    {sepet.durum.subeAdi}
                  </p>

                  <div className="max-h-[24rem] space-y-5 overflow-y-auto px-5 py-4">
                    {sepet.markaGruplari.map((grup) => (
                      <div key={grup.markaId}>
                        <MarkaRozeti ad={grup.markaAdi} renk={grup.markaRengi} />
                        <ul className="mt-3 space-y-3.5">
                          {grup.satirlar.map((satir) => {
                            const anahtar = sepet.anahtarla(satir);
                            return (
                              <li key={anahtar} className="flex items-start gap-3 text-sm">
                                <div className="min-w-0 flex-1">
                                  <p className="leading-snug text-orman-800">{satir.urunAdi}</p>
                                  {satir.secenekler.length > 0 ? (
                                    <p className="mt-0.5 text-xs text-orman-500">
                                      {satir.secenekler.map((s) => s.ad).join(', ')}
                                    </p>
                                  ) : null}
                                  <div className="mt-2 flex items-center gap-1 rounded-full border border-krem-300 p-0.5 w-fit">
                                    <button
                                      type="button"
                                      aria-label={`${satir.urunAdi} adedini azalt`}
                                      onClick={() => sepet.adetDegistir(anahtar, satir.adet - 1)}
                                      className="flex size-6 items-center justify-center rounded-full text-orman-700 transition hover:bg-krem-100"
                                    >
                                      <svg viewBox="0 0 16 16" aria-hidden className="size-3">
                                        <path
                                          d="M3 8h10"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                        />
                                      </svg>
                                    </button>
                                    <span className="min-w-5 text-center text-xs font-semibold tabular-nums">
                                      {satir.adet}
                                    </span>
                                    <button
                                      type="button"
                                      aria-label={`${satir.urunAdi} adedini artır`}
                                      onClick={() => sepet.adetDegistir(anahtar, satir.adet + 1)}
                                      className="flex size-6 items-center justify-center rounded-full text-orman-700 transition hover:bg-krem-100"
                                    >
                                      <svg viewBox="0 0 16 16" aria-hidden className="size-3">
                                        <path
                                          d="M8 3v10M3 8h10"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                        />
                                      </svg>
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

                  <div className="border-t border-krem-200 bg-krem-50 px-5 py-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-orman-500">
                        {sepet.toplamAdet} ürün · {sepet.markaGruplari.length} marka
                      </span>
                      <span className="text-2xl font-semibold tabular-nums text-orman-800">
                        {formatMinor(sepet.toplamMinor)}
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled
                      title="Ödeme adımı henüz bağlanmadı"
                      className="mt-4 w-full rounded-full bg-orman-800 py-3.5 font-medium text-krem-50 transition hover:bg-orman-700 disabled:cursor-not-allowed disabled:bg-krem-200 disabled:text-orman-400"
                    >
                      Ödemeye Geç
                    </button>
                    <p className="mt-3 text-center text-xs leading-relaxed text-orman-500">
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
