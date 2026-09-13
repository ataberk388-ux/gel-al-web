'use client';

/**
 * Ürün kartı.
 *
 * Düzen: **üstte geniş fotoğraf**, altında ad, porsiyon ve fiyat. Önceki yatay
 * kartta görsel 112px'ti; yemek fotoğrafı o boyutta iştah açmıyor, pul gibi
 * duruyordu. Yemeksepeti, Getir ve Uber Eats'in ürün kartları da fotoğrafı
 * kartın tamamı kadar geniş veriyor — satılan şey görselle satılıyor.
 *
 * Ekleme denetimi fotoğrafın sağ alt köşesinde duruyor: ürün sepette değilken
 * dairesel artı, sepete girdikten sonra aynı yerde adet ayarlayıcı. Böylece
 * müşteri kaç tane aldığını görmek için sepeti açmak zorunda kalmıyor.
 *
 * Renk: altın yalnızca "bu ürün sepette" işaretini taşıyor. Sekiz markanın
 * ürünleri alt alta dizilirken her karta renk katılırsa sayfa karnaval oluyor.
 */

import { formatMinor, type MenuProduct } from '@gelal/shared';
import { api } from '@/lib/api';

interface Props {
  urun: MenuProduct;
  /** Şube kapalıysa ekleme yapılamaz. */
  subeAcik: boolean;
  /** Bu ürünün sepetteki toplam adedi. */
  adet: number;
  onEkle: () => void;
  onAzalt: () => void;
}

export function UrunKarti({ urun, subeAcik, adet, onEkle, onAzalt }: Props) {
  const gorsel = api.medya(urun.imagePath ?? urun.thumbnailPath);
  const kapali = !urun.isAvailable || !subeAcik;
  const sepette = adet > 0;

  const altBilgi = [urun.portionLabel, urun.optionGroups[0]?.name].filter(Boolean).join(' · ');

  return (
    <article
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border bg-white shadow-kart transition duration-300 ${
        sepette
          ? 'border-altin-400 shadow-kart-uzeri'
          : 'border-krem-200 hover:-translate-y-1 hover:border-orman-200 hover:shadow-kart-uzeri'
      }`}
    >
      <div className="gorsel-cerceve relative aspect-[16/11] overflow-hidden bg-krem-200">
        {gorsel ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gorsel}
            alt={urun.name}
            width={800}
            height={550}
            loading="lazy"
            className={`h-full w-full object-cover transition duration-700 group-hover:scale-[1.06] ${
              kapali ? 'grayscale' : ''
            }`}
          />
        ) : (
          <span
            aria-hidden
            className="flex h-full w-full items-center justify-center text-4xl text-krem-400"
          >
            🍽
          </span>
        )}

        {/* Tükendi perdesi — fotoğrafın üstünde, kararsızlık bırakmadan */}
        {!urun.isAvailable ? (
          <span className="absolute inset-0 flex items-center justify-center bg-orman-900/45 backdrop-blur-[1px]">
            <span className="rounded-full bg-white/95 px-4 py-1.5 text-xs font-semibold text-orman-700">
              Tükendi
            </span>
          </span>
        ) : null}

        {/* Sepetteki adet rozeti */}
        {sepette ? (
          <span className="absolute left-3 top-3 rounded-full bg-altin-500 px-2.5 py-1 text-xs font-semibold tabular-nums text-white shadow-kart">
            Sepette {adet}
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="text-[0.95rem] font-medium leading-snug text-orman-800">{urun.name}</h3>

        {altBilgi ? <p className="mt-1 text-xs text-orman-500">{altBilgi}</p> : null}

        {urun.description ? (
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-orman-500">
            {urun.description}
          </p>
        ) : null}

        <div className="mt-auto flex items-end justify-between gap-2 pt-4">
          <span className="text-lg font-semibold tabular-nums text-orman-800">
            {formatMinor(urun.priceMinor)}
          </span>

          {!urun.isAvailable ? null : sepette ? (
            <div className="flex items-center gap-1 rounded-full border border-altin-400 bg-altin-300/15 p-1">
              <button
                type="button"
                onClick={onAzalt}
                aria-label={`${urun.name} adedini azalt`}
                className="flex size-8 items-center justify-center rounded-full text-orman-800 transition hover:bg-white"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                  <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
              <span className="min-w-5 text-center text-sm font-semibold tabular-nums text-orman-800">
                {adet}
              </span>
              <button
                type="button"
                onClick={onEkle}
                disabled={!subeAcik}
                aria-label={`${urun.name} adedini artır`}
                className="flex size-8 items-center justify-center rounded-full text-orman-800 transition hover:bg-white disabled:cursor-not-allowed disabled:text-orman-300"
              >
                <svg viewBox="0 0 16 16" aria-hidden className="size-3.5">
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onEkle}
              disabled={kapali}
              aria-label={`${urun.name} ürününü sepete ekle`}
              title={!subeAcik ? 'Şube şu an kapalı' : 'Sepete ekle'}
              className="flex size-11 items-center justify-center rounded-full bg-orman-800 text-krem-50 shadow-kart transition duration-200 hover:-translate-y-0.5 hover:bg-orman-700 active:translate-y-0 disabled:cursor-not-allowed disabled:bg-krem-200 disabled:text-orman-300 disabled:shadow-none disabled:hover:translate-y-0"
            >
              <svg viewBox="0 0 16 16" aria-hidden className="size-4">
                <path
                  d="M8 3v10M3 8h10"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
