/**
 * Marka varlıkları.
 *
 * Kaynak: `HURMET_2.PDF` — altın çember içinde koyu yeşil "H", yaprak ve
 * "HÜRMET GIDA TİC. A.Ş." kilidi. Vektör kaynaktan 2048px'te çizilip beyaz
 * zemini alfaya çevrildi; `public/marka/` altında duruyor.
 *
 * Neden SVG değil: çizim degrade dolgularla yapılmış detaylı bir illüstrasyon.
 * Elle SVG'ye çevirmek altın degradelerin derinliğini kaybettiriyor. Başlıkta
 * 40px, alt bilgide 160px gösterilen bir logo için 900px PNG fazlasıyla keskin.
 *
 * Koyu zeminde `ton="acik"` kullanılmalı: o varyantta yeşil harfler kreme
 * çevrildi, altın olduğu gibi bırakıldı (altın koyu yeşilde zaten parlıyor).
 */

/** Altın çember + H + yaprak. Başlıkta ve dar alanlarda. */
export function HurmetAmblem({
  className = '',
  ton = 'koyu',
}: {
  className?: string;
  ton?: 'koyu' | 'acik';
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ton === 'koyu' ? '/marka/amblem.png' : '/marka/amblem-acik.png'}
      alt=""
      aria-hidden
      width={900}
      height={451}
      className={className}
    />
  );
}

/** Tam kilit: amblem + HÜRMET + GIDA TİC. A.Ş. + slogan. */
export function HurmetKilit({
  className = '',
  ton = 'koyu',
}: {
  className?: string;
  ton?: 'koyu' | 'acik';
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ton === 'koyu' ? '/marka/kilit.png' : '/marka/kilit-acik.png'}
      alt="Hürmet Gıda Tic. A.Ş."
      width={1000}
      height={964}
      className={className}
    />
  );
}

/**
 * Başlık kilidi: amblem + "Hürmet / Gel Al".
 *
 * İki satır kasıtlı — "Hürmet" işletme, "Gel Al" hizmet adı. Tek satıra
 * dizilince üç kelime ezik duruyor ve hangisinin ne olduğu kayboluyor.
 */
export function GelAlLogo({
  className = '',
  ton = 'koyu',
}: {
  className?: string;
  ton?: 'koyu' | 'acik';
}) {
  const yazi = ton === 'koyu' ? '#173d2b' : '#f6f2e9';
  const vurgu = ton === 'koyu' ? '#9c6c15' : '#e8c27a';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <HurmetAmblem ton={ton} className="h-9 w-auto shrink-0" />

      <span className="inline-flex flex-col leading-none">
        <span
          className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.22em]"
          style={{ color: vurgu }}
        >
          Hürmet
        </span>
        <span
          className="mt-1 font-display text-[1.3rem] font-semibold leading-none tracking-tight"
          style={{ color: yazi }}
        >
          Gel Al
        </span>
      </span>
    </span>
  );
}

/** İşletme künyesi — alt bilgide metin içinde kullanılır. */
export function HurmetIsaret({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-display text-sm font-semibold uppercase tracking-[0.18em] ${className}`}
    >
      Hürmet Gıda
    </span>
  );
}
