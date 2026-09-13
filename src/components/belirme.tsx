'use client';

/**
 * Görünüre girince beliren sarmalayıcı.
 *
 * Kart listeleri sayfa kaydırılırken sırayla belirsin diye. `gecikme` ile
 * ardışık kartlara kademe verilir — hepsi aynı anda belirirse hareket
 * fark edilmiyor, sadece bir titreşim gibi duruyor.
 *
 * Bir kere belirdikten sonra gözlemci sökülüyor: kullanıcı yukarı kaydırıp
 * geri döndüğünde kartların tekrar tekrar yanıp sönmesi rahatsız edici.
 */

import { useEffect, useRef, useState } from 'react';

export function Belirme({
  children,
  gecikme = 0,
  className = '',
}: {
  children: React.ReactNode;
  /** Milisaniye. Listelerde sıraya göre kademe vermek için. */
  gecikme?: number;
  className?: string;
}) {
  const kap = useRef<HTMLDivElement | null>(null);
  const [gorundu, setGorundu] = useState(false);

  useEffect(() => {
    const hedef = kap.current;
    if (!hedef) return;

    // Sunucudan gelen HTML'de sınıf yok; ilk boyamadan sonra ekleniyor.
    // Ekranda zaten duran kartlar için gözlemci hemen tetikleniyor.
    const gozlemci = new IntersectionObserver(
      ([giris]) => {
        if (giris?.isIntersecting) {
          setGorundu(true);
          gozlemci.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' },
    );

    gozlemci.observe(hedef);
    return () => gozlemci.disconnect();
  }, []);

  return (
    <div
      ref={kap}
      className={`belir ${gorundu ? 'belir-gorundu' : ''} ${className}`}
      style={gecikme ? { transitionDelay: `${gecikme}ms` } : undefined}
    >
      {children}
    </div>
  );
}
