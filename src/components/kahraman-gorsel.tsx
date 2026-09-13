'use client';

/**
 * Kahraman görsel döngüsü.
 *
 * Tek sabit fotoğraf menünün derinliğini göstermiyordu: sekiz marka, 462 ürün
 * var ama ana sayfada bir tabak duruyordu. Döngü her birkaç saniyede farklı
 * bir markadan bir imza yemeğe geçiyor.
 *
 * FOTOĞRAFLARI DEĞİŞTİRMEK için aşağıdaki `KARELER` listesini düzenle. Yol,
 * `MediaAsset.path` değeriyle aynı — yani seed'in `.data/media` altına yazdığı
 * dosya yolu. Yeni bir ürün fotoğrafı kullanmak için o ürünün yolunu
 * `pnpm db:studio` üzerinden veya menü raporundan alabilirsin.
 */

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

interface Kare {
  /** MediaAsset.path — .data/media altındaki yol. */
  yol: string;
  /** Görselin üstünde gösterilecek etiket. */
  baslik: string;
  marka: string;
}

// ---------------------------------------------------------------------------
// Döngüdeki fotoğraflar — düzenlenecek yer burası.
// ---------------------------------------------------------------------------
const KARELER: Kare[] = [
  {
    yol: 'products/tikabasa-pilav-tikabasa-double-tavuklu-pilav.webp',
    baslik: 'Tıkabasa Double Tavuklu Pilav',
    marka: 'Tıkabasa Pilav',
  },
  {
    yol: 'products/hurmet-mutfak-ev-yemekleri-manti-kayseri-manti-300-gr.webp',
    baslik: 'Kayseri Mantısı',
    marka: 'Hürmet Mutfak',
  },
  {
    yol: 'products/hurmet-mutfak-ev-yemekleri-etli-yemekler-izgara-tavuk-pirinc-pilavi-350-gr.webp',
    baslik: 'Izgara Tavuk & Pirinç Pilavı',
    marka: 'Hürmet Mutfak',
  },
  {
    yol: 'products/sadece-manti-citir-manti.webp',
    baslik: 'Çıtır Mantı',
    marka: 'Sadece Mantı',
  },
  {
    yol: 'products/kaynar-tencere-dubai-cup.webp',
    baslik: 'Dubai Cup',
    marka: 'Kaynar Tencere',
  },
];

const GECIS_MS = 4500;

export function KahramanGorsel() {
  const [aktif, setAktif] = useState(0);
  const [duraklat, setDuraklat] = useState(false);
  const [hareketAcik, setHareketAcik] = useState(true);

  useEffect(() => {
    const sorgu = window.matchMedia('(prefers-reduced-motion: reduce)');
    const uygula = () => setHareketAcik(!sorgu.matches);
    uygula();
    sorgu.addEventListener('change', uygula);
    return () => sorgu.removeEventListener('change', uygula);
  }, []);

  useEffect(() => {
    if (!hareketAcik || duraklat) return;
    const sayac = window.setInterval(
      () => setAktif((mevcut) => (mevcut + 1) % KARELER.length),
      GECIS_MS,
    );
    return () => window.clearInterval(sayac);
  }, [hareketAcik, duraklat]);

  const kare = KARELER[aktif];

  return (
    <div
      className="relative"
      onMouseEnter={() => setDuraklat(true)}
      onMouseLeave={() => setDuraklat(false)}
    >
      <div className="gorsel-cerceve relative aspect-[4/3] overflow-hidden rounded-[2rem] bg-krem-200 shadow-kart-uzeri">
        {/*
         * Tüm kareler DOM'da duruyor ve opaklıkla geçiş yapıyor. Tek <img>'in
         * src'sini değiştirmek yeni fotoğraf inene kadar boşluk bırakıyordu.
         */}
        {KARELER.map((k, sira) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={k.yol}
            src={api.medya(k.yol) ?? ''}
            alt={sira === aktif ? `${k.baslik} — ${k.marka}` : ''}
            width={1200}
            height={900}
            // İlk kare hemen, diğerleri arka planda yüklensin.
            loading={sira === 0 ? 'eager' : 'lazy'}
            aria-hidden={sira !== aktif}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ease-out ${
              sira === aktif ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}

        {/*
         * Yemeğin adı ÜSTTE duruyor: altta "462 ürün" bilgi kartı fotoğrafın
         * sol alt köşesine biniyor ve adı kapatıyordu.
         */}
        <div className="pointer-events-none absolute inset-x-0 top-0 bg-gradient-to-b from-orman-900/85 via-orman-900/30 to-transparent px-6 pb-16 pt-6">
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-altin-300">
            {kare?.marka}
          </p>
          <p className="mt-1 font-display text-xl font-semibold text-krem-50">{kare?.baslik}</p>
        </div>
      </div>

      {/* Kare seçiciler — otomatik döngüyü elle de sürebilmek için */}
      <div className="mt-4 flex items-center justify-center gap-2">
        {KARELER.map((k, sira) => (
          <button
            key={k.yol}
            type="button"
            onClick={() => setAktif(sira)}
            aria-label={`${k.baslik} görselini göster`}
            aria-current={sira === aktif}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              sira === aktif ? 'w-8 bg-orman-700' : 'w-2.5 bg-krem-300 hover:bg-orman-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
