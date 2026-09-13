/**
 * Şube kartı.
 *
 * Düzen küresel sipariş sitelerinin (Deliveroo, Wolt, Uber Eats) restoran
 * kartıyla aynı mantıkta: **üstte geniş görsel, altında bilgi**. Önceki yatay
 * kart dar bir kolonda iyi duruyordu ama geniş ekranda üç sütuna geçilince
 * fotoğraf pul gibi kalıyordu — kartın satılan şey yemek olduğunu göstermesi
 * gerekiyor.
 *
 * Açık/kapalı durumu görselin üstünde bir etikette: müşterinin karta bakarken
 * ilk sorduğu soru bu ve metnin içine gömülürse gözden kaçıyor.
 *
 * `genis`: şube sayısı azken (Hürmet Gıda'da bugün iki şube var) üç sütunlu
 * ızgara sağda boş bir hücre bırakıyor. O durumda kart geniş ekranda YATAY
 * düzene geçiyor ve iki kart satırı tam dolduruyor. Az sayıda sonucu büyük
 * yatay kartla göstermek küresel sipariş sitelerinin de yaptığı şey.
 */

import Link from 'next/link';
import { WEB_PATHS, type BranchSummary } from '@gelal/shared';
import { api } from '@/lib/api';
import { MarkaRozeti } from '@/components/marka-rozeti';

export function SubeKarti({ sube, genis = false }: { sube: BranchSummary; genis?: boolean }) {
  const kapak = api.medya(sube.coverPath);

  return (
    <Link
      href={WEB_PATHS.sube(sube.slug)}
      className={`group flex h-full overflow-hidden rounded-2xl border border-krem-200 bg-white shadow-kart transition duration-300 hover:-translate-y-0.5 hover:border-orman-200 hover:shadow-kart-uzeri ${
        genis ? 'flex-col xl:flex-row' : 'flex-col'
      }`}
    >
      <div
        className={`gorsel-cerceve relative overflow-hidden bg-krem-200 ${
          genis ? 'aspect-[16/10] xl:aspect-auto xl:w-2/5 xl:shrink-0' : 'aspect-[16/10]'
        }`}
      >
        {kapak ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={kapak}
            alt=""
            width={768}
            height={480}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
          />
        ) : null}

        {/* Durum etiketi — kartın ilk okunan bilgisi */}
        <span
          className={`absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium backdrop-blur ${
            sube.isOpen ? 'bg-white/92 text-orman-700' : 'bg-orman-900/75 text-krem-200'
          }`}
        >
          <span
            aria-hidden
            className={`size-1.5 rounded-full ${sube.isOpen ? 'bg-orman-500' : 'bg-krem-400'}`}
          />
          {sube.isOpen ? 'Siparişe açık' : 'Şu an kapalı'}
        </span>

        <span className="absolute right-3 top-3 rounded-full bg-orman-900/70 px-3 py-1.5 text-xs font-medium text-krem-100 backdrop-blur">
          ~{sube.prepMinutes} dk
        </span>

        <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-orman-900/80 to-transparent px-4 pb-3 pt-10 text-[0.65rem] font-semibold uppercase tracking-[0.16em] text-krem-100">
          Hürmet Gıda
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${genis ? 'p-5 xl:p-7' : 'p-5'}`}>
        <h3 className="text-xl font-semibold leading-snug text-orman-800">{sube.name}</h3>
        <p className="mt-1 text-sm text-orman-500">
          {sube.addressLine} · {sube.district}/{sube.city}
        </p>

        <p className="mt-3 text-sm text-orman-600">
          <span className="font-medium text-orman-800">{sube.productCount}</span> ürün ·{' '}
          <span className="font-medium text-orman-800">{sube.brands.length}</span> marka
        </p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {sube.brands.slice(0, 3).map((marka) => (
            <li key={marka.id}>
              <MarkaRozeti ad={marka.name} renk={marka.colorHex} />
            </li>
          ))}
          {sube.brands.length > 3 ? (
            <li className="self-center rounded-full bg-krem-100 px-2.5 py-1 text-xs font-medium text-orman-600">
              +{sube.brands.length - 3} marka
            </li>
          ) : null}
        </ul>

        <span className="mt-auto flex items-center gap-1.5 pt-5 text-sm font-medium text-orman-700 transition group-hover:text-orman-900">
          Menüyü gör
          <svg viewBox="0 0 16 16" fill="none" aria-hidden className="size-4 transition duration-300 group-hover:translate-x-1">
            <path
              d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </Link>
  );
}
