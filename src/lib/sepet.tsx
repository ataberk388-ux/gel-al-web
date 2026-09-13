'use client';

/**
 * Ortak sepet — Faz 1'in can alıcı kuralı burada uygulanıyor.
 *
 *   • Sepet yalnızca TEK şubeye aittir.
 *   • Aynı şubedeki farklı markaların ürünleri birleşir ve markaya göre gruplanır.
 *   • Başka şubeden ürün eklenmek istenirse kullanıcıya sorulur, onaylanırsa
 *     sepet temizlenip yeni şubeyle başlanır (plan 4.1: "şube değişikliğinde
 *     sepet uyarısı ve kontrollü temizleme").
 *
 * Şimdilik tarayıcıda (localStorage) tutuluyor. apps/api geldiğinde sunucu
 * tarafı `carts` tablosuna taşınacak; bileşenlerin kullandığı arayüz aynı kalır.
 * Tutarlar her zaman kuruş cinsinden tam sayı — @gelal/shared/money.ts.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { multiplyMinor, sumMinor, type Minor } from '@gelal/shared';

const DEPO_ANAHTARI = 'gelal.sepet.v1';

export interface SepetSatiri {
  urunId: string;
  urunAdi: string;
  markaId: string;
  markaAdi: string;
  markaRengi: string | null;
  birimFiyatMinor: Minor;
  adet: number;
  gorselYolu: string | null;
  secenekler: { id: string; ad: string; farkMinor: Minor }[];
}

interface SepetDurumu {
  subeId: string | null;
  subeAdi: string | null;
  subeSlug: string | null;
  satirlar: SepetSatiri[];
}

const BOS: SepetDurumu = { subeId: null, subeAdi: null, subeSlug: null, satirlar: [] };

/** Bir satırın toplamı: (birim fiyat + seçenek farkları) × adet. */
export function satirToplami(satir: SepetSatiri): Minor {
  const birim = sumMinor(satir.birimFiyatMinor, ...satir.secenekler.map((s) => s.farkMinor));
  return multiplyMinor(birim, satir.adet);
}

/** Aynı ürün + aynı seçenek kümesi tek satırda toplanır. */
function satirAnahtari(urunId: string, secenekIdleri: string[]): string {
  return `${urunId}::${[...secenekIdleri].sort().join(',')}`;
}

interface SepetBaglami {
  durum: SepetDurumu;
  toplamMinor: Minor;
  toplamAdet: number;
  /** Markaya göre gruplanmış satırlar — sepet panelindeki gösterim bu sırayı kullanır. */
  markaGruplari: { markaId: string; markaAdi: string; markaRengi: string | null; satirlar: SepetSatiri[] }[];
  /** Farklı şube seçilirse `subeDegisikligi` döner; onay sonrası tekrar çağrılır. */
  ekle: (
    sube: { id: string; ad: string; slug: string },
    satir: Omit<SepetSatiri, 'adet'>,
    adet?: number,
  ) => { durum: 'eklendi' } | { durum: 'subeDegisikligi'; mevcutSube: string };
  adetDegistir: (anahtar: string, adet: number) => void;
  cikar: (anahtar: string) => void;
  temizle: () => void;
  anahtarla: (satir: SepetSatiri) => string;
}

const Baglam = createContext<SepetBaglami | null>(null);

export function SepetSaglayici({ children }: { children: React.ReactNode }) {
  const [durum, setDurum] = useState<SepetDurumu>(BOS);
  const [yuklendi, setYuklendi] = useState(false);

  // localStorage sunucuda yok; ilk render'dan sonra okunur.
  useEffect(() => {
    try {
      const ham = window.localStorage.getItem(DEPO_ANAHTARI);
      if (ham) setDurum(JSON.parse(ham) as SepetDurumu);
    } catch {
      // Gizli sekme veya engellenmiş depolama — sepet boş başlar, sayfa çalışır.
    }
    setYuklendi(true);
  }, []);

  useEffect(() => {
    if (!yuklendi) return;
    try {
      window.localStorage.setItem(DEPO_ANAHTARI, JSON.stringify(durum));
    } catch {
      // Yazılamazsa sepet yalnızca bu oturumda yaşar.
    }
  }, [durum, yuklendi]);

  const anahtarla = useCallback(
    (satir: SepetSatiri) => satirAnahtari(satir.urunId, satir.secenekler.map((s) => s.id)),
    [],
  );

  const ekle = useCallback<SepetBaglami['ekle']>(
    (sube, satir, adet = 1) => {
      // KURAL: bir sepet yalnızca tek şubeye ait olabilir.
      //
      // Bu kontrol setDurum güncelleyicisinin İÇİNDE yapılamaz: React
      // güncelleyiciyi senkron çalıştırmadığı için dönüş değeri her zaman
      // "eklendi" oluyor, uyarı hiç görünmüyor ve tıklama sessizce kayboluyordu.
      // Olay işleyicisinde `durum` zaten güncel render'ın değeri.
      if (durum.subeId && durum.subeId !== sube.id && durum.satirlar.length > 0) {
        return { durum: 'subeDegisikligi', mevcutSube: durum.subeAdi ?? '' };
      }

      const anahtar = satirAnahtari(
        satir.urunId,
        satir.secenekler.map((s) => s.id),
      );

      setDurum((onceki) => {
        const mevcut = onceki.satirlar.find(
          (s) => satirAnahtari(s.urunId, s.secenekler.map((o) => o.id)) === anahtar,
        );
        const satirlar = mevcut
          ? onceki.satirlar.map((s) => (s === mevcut ? { ...s, adet: s.adet + adet } : s))
          : [...onceki.satirlar, { ...satir, adet }];

        return { subeId: sube.id, subeAdi: sube.ad, subeSlug: sube.slug, satirlar };
      });

      return { durum: 'eklendi' };
    },
    [durum],
  );

  const adetDegistir = useCallback((anahtar: string, adet: number) => {
    setDurum((onceki) => {
      const satirlar = onceki.satirlar
        .map((s) =>
          satirAnahtari(s.urunId, s.secenekler.map((o) => o.id)) === anahtar ? { ...s, adet } : s,
        )
        .filter((s) => s.adet > 0);
      return satirlar.length === 0 ? BOS : { ...onceki, satirlar };
    });
  }, []);

  const cikar = useCallback(
    (anahtar: string) => adetDegistir(anahtar, 0),
    [adetDegistir],
  );

  const temizle = useCallback(() => setDurum(BOS), []);

  const deger = useMemo<SepetBaglami>(() => {
    const toplamMinor = durum.satirlar.length
      ? sumMinor(...durum.satirlar.map(satirToplami))
      : 0;
    const toplamAdet = durum.satirlar.reduce((toplam, s) => toplam + s.adet, 0);

    const gruplar = new Map<string, SepetBaglami['markaGruplari'][number]>();
    for (const satir of durum.satirlar) {
      const grup = gruplar.get(satir.markaId) ?? {
        markaId: satir.markaId,
        markaAdi: satir.markaAdi,
        markaRengi: satir.markaRengi,
        satirlar: [],
      };
      grup.satirlar.push(satir);
      gruplar.set(satir.markaId, grup);
    }

    return {
      durum,
      toplamMinor,
      toplamAdet,
      markaGruplari: [...gruplar.values()],
      ekle,
      adetDegistir,
      cikar,
      temizle,
      anahtarla,
    };
  }, [durum, ekle, adetDegistir, cikar, temizle, anahtarla]);

  return <Baglam.Provider value={deger}>{children}</Baglam.Provider>;
}

export function useSepet(): SepetBaglami {
  const baglam = useContext(Baglam);
  if (!baglam) throw new Error('useSepet, SepetSaglayici içinde kullanılmalı.');
  return baglam;
}
