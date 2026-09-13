/**
 * Gel-Al marka işaretleri.
 *
 * GEÇİCİ: Hürmet Gıda'nın özgün logo dosyaları henüz elimizde yok. Bu SVG'ler
 * mockup'taki kimliğe (altın kubbe mührü + serif "Gel Al" yazısı) sadık kalarak
 * çizildi. Gerçek logolar `apps/web/public/marka/` altına konulduğunda bu
 * bileşenlerin içi `<img>` ile değiştirilir; kullanan hiçbir sayfa değişmez.
 */

export function GelAlLogo({
  className = '',
  ton = 'koyu',
}: {
  className?: string;
  /** Açık zeminde "koyu", koyu zeminde "acik". */
  ton?: 'koyu' | 'acik';
}) {
  const yazi = ton === 'koyu' ? '#173d2b' : '#f7f4ec';

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        viewBox="0 0 32 32"
        aria-hidden
        className="size-8 shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Kapaklı tencere/kubbe — sıcak yemek ve "teslim alma" çağrışımı */}
        <path
          d="M4 22c0-6.6 5.4-12 12-12s12 5.4 12 12H4Z"
          fill="#d9a441"
        />
        <path d="M2.5 22h27a1.5 1.5 0 0 1 0 3h-27a1.5 1.5 0 0 1 0-3Z" fill="#b9832c" />
        <path d="M16 5.5a1.6 1.6 0 1 1 0 3.2 1.6 1.6 0 0 1 0-3.2Z" fill="#b9832c" />
        {/* Buhar */}
        <path
          d="M16 15.5c1.9 0 3.4 1.3 3.4 3 0 1.2-.8 2-1.9 2.6"
          stroke="#fff"
          strokeOpacity="0.55"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>

      <span
        className="font-display text-[1.35rem] leading-none font-semibold tracking-tight"
        style={{ color: yazi }}
      >
        Gel Al
      </span>
    </span>
  );
}

/** İşletme kilidi — altbilgide ve şube kartlarında kullanılır. */
export function HurmetIsaret({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-display text-sm font-semibold uppercase tracking-[0.18em] ${className}`}
    >
      Hürmet Gıda
    </span>
  );
}
