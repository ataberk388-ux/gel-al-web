/**
 * Marka rozeti.
 *
 * Marka rengi doygun bir dolgu olarak değil, **yumuşak bir ton** olarak
 * kullanılıyor: zemin rengin %12 saydamı, metin rengin koyusu. Sekiz markanın
 * doygun rengi yan yana gelince sayfa karnaval gibi görünüyor ve yemek
 * fotoğraflarıyla yarışıyordu.
 */

/** "#C8912F" → "rgb(200 145 47 / <alfa>)" */
function tonla(hex: string, alfa: number): string {
  const temiz = hex.replace('#', '');
  const r = parseInt(temiz.slice(0, 2), 16);
  const g = parseInt(temiz.slice(2, 4), 16);
  const b = parseInt(temiz.slice(4, 6), 16);
  return `rgb(${r} ${g} ${b} / ${alfa})`;
}

export function MarkaRozeti({
  ad,
  renk,
  boyut = 'kucuk',
}: {
  ad: string;
  renk: string | null;
  boyut?: 'kucuk' | 'orta';
}) {
  const temel = renk ?? '#2a5a3f';
  const olcu = boyut === 'orta' ? 'px-3 py-1.5 text-sm' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-block rounded-full font-medium ${olcu}`}
      style={{ backgroundColor: tonla(temel, 0.12), color: temel }}
    >
      {ad}
    </span>
  );
}
