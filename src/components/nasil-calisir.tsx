'use client';

/**
 * "Nasıl çalışır?" — ilerleyen adım şeridi.
 *
 * Amaç süs değil: Gel-Al modelini ilk kez gören müşteriye "online öde, şubeden
 * al" akışının BİR SIRA olduğunu göstermek. Durağan dört kutu bu sırayı
 * anlatmıyordu.
 *
 * Düzen küresel sipariş sitelerinin tanıtım bölümlerini izliyor: solda ürünü
 * gösteren fotoğraf kompozisyonu, sağda dikey adım listesi ve adımlar arasında
 * dolan bir ilerleme çizgisi. Koyu yeşil zemin marka kimliğinin ana rengi;
 * altın vurgu üzerinde parlıyor.
 *
 * Davranış kuralları:
 *   • Fare bir adımın üstündeyken ilerleme durur ve o adım sabitlenir.
 *   • Bölüm ekranda değilken zamanlayıcı çalışmaz.
 *   • `prefers-reduced-motion` açıksa otomatik ilerleme hiç başlamaz ve tüm
 *     adımlar aynı anda vurgulu görünür.
 */

import { useEffect, useRef, useState } from 'react';
import { api } from '@/lib/api';

const ADIM_SURESI_MS = 3400;

/** Sol taraftaki fotoğraf. Değiştirmek için yolu düzenle. */
const KOMPOZISYON = {
  buyuk: 'products/hurmet-mutfak-ev-yemekleri-etli-yemekler-izgara-tavuk-pirinc-pilavi-350-gr.webp',
};

interface Adim {
  baslik: string;
  aciklama: string;
  simge: React.ReactNode;
}

const ADIMLAR: Adim[] = [
  {
    baslik: 'Şubeni seç',
    aciklama:
      'İlçeni yaz, sana en yakın Hürmet Gıda şubesini bul. Açık mı, ne kadar sürede hazır olur, hemen gör.',
    simge: (
      <>
        <path
          d="M12 21s7-5.7 7-11a7 7 0 1 0-14 0c0 5.3 7 11 7 11Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    baslik: 'Sepetini kur',
    aciklama:
      'Aynı şubedeki farklı markaların ürünlerini tek sepette birleştir. Pilavın, mezen ve tatlın aynı siparişte.',
    simge: (
      <>
        <path
          d="M4 8h16l-1.4 10.2A2 2 0 0 1 16.6 20H7.4a2 2 0 0 1-2-1.8L4 8Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="currentColor" strokeWidth="1.5" />
      </>
    ),
  },
  {
    baslik: 'Online öde',
    aciklama:
      'Ödemeni 3D Secure ile güvenle tamamla. Sipariş ancak ödeme onaylandıktan sonra şubeye düşer.',
    simge: (
      <>
        <rect x="3" y="6" width="18" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 10.5h18" stroke="currentColor" strokeWidth="1.5" />
        <path d="M7 14.5h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </>
    ),
  },
  {
    baslik: 'Gel al',
    aciklama:
      'Siparişin hazır olunca haber veriyoruz. Şubeye uğra, dört haneli teslim kodunu söyle, al.',
    simge: (
      <>
        <path
          d="M5 9h14l-1 10.2A2 2 0 0 1 16 21H8a2 2 0 0 1-2-1.8L5 9Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M9 12.5l2 2 4-4"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
];

export function NasilCalisir() {
  const [aktif, setAktif] = useState(0);
  const [duraklat, setDuraklat] = useState(false);
  const [hareketAcik, setHareketAcik] = useState(true);
  const [gorunur, setGorunur] = useState(false);
  const bolum = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sorgu = window.matchMedia('(prefers-reduced-motion: reduce)');
    const uygula = () => setHareketAcik(!sorgu.matches);
    uygula();
    sorgu.addEventListener('change', uygula);
    return () => sorgu.removeEventListener('change', uygula);
  }, []);

  useEffect(() => {
    const hedef = bolum.current;
    if (!hedef) return;
    const gozlemci = new IntersectionObserver(
      ([giris]) => setGorunur(Boolean(giris?.isIntersecting)),
      { threshold: 0.2 },
    );
    gozlemci.observe(hedef);
    return () => gozlemci.disconnect();
  }, []);

  useEffect(() => {
    if (!hareketAcik || duraklat || !gorunur) return;
    const sayac = window.setInterval(
      () => setAktif((mevcut) => (mevcut + 1) % ADIMLAR.length),
      ADIM_SURESI_MS,
    );
    return () => window.clearInterval(sayac);
  }, [hareketAcik, duraklat, gorunur]);

  const vurgulu = (sira: number) => !hareketAcik || sira <= aktif;
  const ilerleme = hareketAcik ? ((aktif + 0.5) / ADIMLAR.length) * 100 : 100;

  return (
    <section ref={bolum} id="nasil-calisir" className="mt-24 scroll-mt-24 bg-orman-900">
      <div className="kabuk py-20 lg:py-24">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          {/* Fotoğraf kompozisyonu */}
          <div className="relative mx-auto w-full max-w-md lg:mx-0">
            <div className="gorsel-cerceve relative overflow-hidden rounded-[2rem] shadow-kart-uzeri">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={api.medya(KOMPOZISYON.buyuk) ?? ''}
                alt=""
                aria-hidden
                width={900}
                height={1100}
                loading="lazy"
                className="aspect-[4/5] w-full object-cover"
              />
            </div>

            <div className="absolute -left-4 -top-5 hidden rounded-2xl bg-altin-400 px-5 py-3.5 shadow-kart-uzeri sm:block">
              <p className="font-display text-xl font-semibold leading-none text-orman-900">
                ~25 dk
              </p>
              <p className="mt-1 text-[0.7rem] font-medium text-orman-800">ortalama hazırlanma</p>
            </div>
          </div>

          {/* Adımlar */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-altin-300">
              Dört adım
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-krem-50 sm:text-4xl">
              Nasıl çalışır?
            </h2>
            <p className="mt-4 max-w-md leading-relaxed text-orman-200">
              Kurye beklemek yok. Siparişini önceden ver, hazır olduğunda şubeden teslim al.
            </p>

            <ol className="relative mt-10 space-y-2" onMouseLeave={() => setDuraklat(false)}>
              {/* Dikey ilerleme çizgisi — madalyonların tam ortasından geçer */}
              <span aria-hidden className="absolute bottom-6 left-10 top-6 w-px bg-orman-700">
                <span
                  className="absolute inset-x-0 top-0 bg-gradient-to-b from-altin-400 to-altin-300 transition-[height] duration-700 ease-out"
                  style={{ height: `${ilerleme}%` }}
                />
              </span>

              {ADIMLAR.map((adim, sira) => {
                const acik = vurgulu(sira);
                const suanki = hareketAcik && sira === aktif;

                return (
                  <li
                    key={adim.baslik}
                    onMouseEnter={() => {
                      setDuraklat(true);
                      setAktif(sira);
                    }}
                    className={`relative flex gap-5 rounded-2xl p-4 transition-colors duration-500 ${
                      suanki ? 'bg-orman-800/70' : ''
                    }`}
                  >
                    <span
                      aria-hidden
                      className={`relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${
                        acik
                          ? 'border-altin-400 bg-altin-400 text-orman-900'
                          : 'border-orman-700 bg-orman-900 text-orman-400'
                      } ${suanki ? 'scale-110 shadow-kart-uzeri' : ''}`}
                    >
                      <svg viewBox="0 0 24 24" fill="none" className="size-5">
                        {adim.simge}
                      </svg>
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <p
                        className={`font-display text-xs font-semibold tabular-nums transition-colors duration-500 ${
                          acik ? 'text-altin-300' : 'text-orman-500'
                        }`}
                      >
                        {String(sira + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-0.5 text-lg font-semibold text-krem-50">{adim.baslik}</h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-orman-200">
                        {adim.aciklama}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
