'use client';

/**
 * Sayfa içeriği çizilemediğinde görünen ekran.
 *
 * En sık sebebi: `gelal-api` ayakta değil ya da ağ üzerinden erişilemiyor.
 * Ön yüz ile backend ayrı süreçler olduğu için bu gerçek bir ihtimal — tek
 * uygulamayken "veritabanı düştü" demek uygulamanın da düşmesi anlamına
 * geliyordu, artık site ayakta kalıp durumu anlatabiliyor.
 *
 * Hata metni üretimde Next tarafından gizlenir (yığın izi tarayıcıya
 * gönderilmez); `digest` ile sunucu günlüğünden eşleştirilir.
 */

import Link from 'next/link';
import { WEB_PATHS } from '@gelal/shared';

export default function Hata({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <div className="kabuk-dar flex flex-col items-center py-24 text-center">
      <p className="text-4xl" aria-hidden>
        🍲
      </p>

      <h1 className="mt-5 text-2xl font-semibold text-orman-800">İçerik yüklenemedi</h1>

      <p className="mt-3 leading-relaxed text-orman-600">
        Menü ve şube bilgilerine şu anda ulaşamıyoruz. Bağlantın yerindeyse sorun bizde —
        birazdan tekrar dene.
      </p>

      {error.digest ? (
        <p className="mt-3 text-xs text-orman-400">Hata kodu: {error.digest}</p>
      ) : null}

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-full bg-orman-800 px-6 py-3 text-sm font-medium text-krem-50 transition hover:bg-orman-700"
        >
          Tekrar dene
        </button>
        <Link
          href={WEB_PATHS.anasayfa()}
          className="rounded-full border border-krem-300 px-6 py-3 text-sm font-medium text-orman-700 transition hover:bg-white"
        >
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}
