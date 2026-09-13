/**
 * Marka şeridi.
 *
 * Küresel sipariş sitelerinde kahraman bölümünün hemen altında mutfak
 * kategorileri şeridi olur (Wolt'ta "Pizza · Burger · Sushi"). Buradaki
 * karşılığı Hürmet Gıda'nın sekiz markası: müşteri şubeye girmeden önce ne
 * bulacağını görüyor.
 *
 * Şerit aynı zamanda geniş ekranda kahraman ile şube listesi arasındaki boşluğu
 * dolduruyor — ama dolgu malzemesi değil, gerçek bilgi taşıyor.
 */

import type { BrandRef } from '@gelal/shared';

/** Marka renginin yumuşak tonu — doygun sekiz renk yan yana karnaval oluyor. */
function tonla(hex: string, alfa: number): string {
  const temiz = hex.replace('#', '');
  const r = parseInt(temiz.slice(0, 2), 16);
  const g = parseInt(temiz.slice(2, 4), 16);
  const b = parseInt(temiz.slice(4, 6), 16);
  return `rgb(${r} ${g} ${b} / ${alfa})`;
}

export function MarkaSeridi({ markalar }: { markalar: BrandRef[] }) {
  if (markalar.length === 0) return null;

  return (
    <section aria-labelledby="markalar-baslik" className="kabuk mt-20">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 id="markalar-baslik" className="text-lg font-semibold text-orman-800">
          Tek sepette birleşen markalar
        </h2>
        <p className="text-sm text-orman-500">
          {markalar.length} marka · hepsi aynı siparişte
        </p>
      </div>

      <ul className="serit mt-6 flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:overflow-visible md:pb-0 lg:grid-cols-4">
        {markalar.map((marka) => {
          const renk = marka.colorHex ?? '#2a5a3f';
          return (
            <li key={marka.id} className="shrink-0 md:shrink">
              <div
                className="flex h-full items-center gap-2.5 rounded-full border border-krem-200 bg-white py-2.5 pl-3 pr-5 shadow-kart transition duration-300 hover:-translate-y-0.5 hover:shadow-kart-uzeri"
                style={{ borderColor: tonla(renk, 0.25) }}
              >
                <span
                  aria-hidden
                  className="flex size-8 items-center justify-center rounded-full font-display text-sm font-semibold"
                  style={{ backgroundColor: tonla(renk, 0.14), color: renk }}
                >
                  {marka.name.charAt(0)}
                </span>
                <span className="truncate text-sm font-medium text-orman-800 md:whitespace-normal">
                  {marka.name}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
